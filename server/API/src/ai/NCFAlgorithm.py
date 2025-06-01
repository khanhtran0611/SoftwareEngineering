import os
import torch
import pandas as pd
from NCF import NCF

class NCFAlgorithm:
    """
    Wrapper for training, saving, loading, and recommending with the NCF model.
    """
    def __init__(self, ratings_path="dataset/destination_review.csv", model_path="ncf_model.pt", embedding_dim=32, hidden_layers=[64, 32, 16, 8]):
        self.ratings_path = ratings_path
        self.model_path = model_path
        self.embedding_dim = embedding_dim
        self.hidden_layers = hidden_layers
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._prepare_data()
        self.model = NCF(self.num_users, self.num_items, embedding_dim, hidden_layers).to(self.device)

    def _prepare_data(self):
        df = pd.read_csv(self.ratings_path)
        self.user2idx = {user: idx for idx, user in enumerate(df['user_id'].unique())}
        self.item2idx = {item: idx for idx, item in enumerate(df['destination_id'].unique())}
        self.idx2item = {idx: item for item, idx in self.item2idx.items()}
        self.num_users = len(self.user2idx)
        self.num_items = len(self.item2idx)
        df['user_idx'] = df['user_id'].map(self.user2idx)
        df['item_idx'] = df['destination_id'].map(self.item2idx)
        self.df = df

    def train(self, epochs=10, lr=0.001, batch_size=256):
        from torch.utils.data import DataLoader, TensorDataset
        users = torch.tensor(self.df['user_idx'].values, dtype=torch.long)
        items = torch.tensor(self.df['item_idx'].values, dtype=torch.long)
        ratings = torch.tensor(self.df['rating'].values, dtype=torch.float)
        dataset = TensorDataset(users, items, ratings)
        loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
        optimizer = torch.optim.Adam(self.model.parameters(), lr=lr)
        criterion = torch.nn.BCELoss()
        self.model.train()
        for epoch in range(epochs):
            total_loss = 0
            for u, i, r in loader:
                u, i, r = u.to(self.device), i.to(self.device), r.to(self.device)
                pred = self.model(u, i)
                loss = criterion(pred, r)
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                total_loss += loss.item()
            print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss/len(loader):.4f}")

    def save(self):
        torch.save(self.model.state_dict(), self.model_path)

    def load(self):
        self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
        self.model.eval()

    def recommend(self, user_id, top_k=10):
        user_idx = self.user2idx.get(user_id, None)
        if user_idx is None:
            raise ValueError("Unknown user")
        user_tensor = torch.tensor([user_idx] * self.num_items, dtype=torch.long).to(self.device)
        item_tensor = torch.arange(self.num_items, dtype=torch.long).to(self.device)
        with torch.no_grad():
            scores = self.model(user_tensor, item_tensor)
        top_items = torch.topk(scores, top_k).indices.cpu().numpy()
        recommended_destinations = [self.idx2item[idx] for idx in top_items]
        return recommended_destinations

    def run(self, user_id, top_k=10, retrain=False):
        if not os.path.exists(self.model_path) or retrain:
            self.train()
            self.save()
        else:
            self.load()
        return self.recommend(user_id, top_k)