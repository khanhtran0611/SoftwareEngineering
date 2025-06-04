import os
import torch
import pandas as pd
import numpy as np
from NCF import NCF
from sklearn.metrics import mean_squared_error, mean_absolute_error
from torch.utils.data import DataLoader, TensorDataset
class RecSysNCF:
    def __init__(self, ratings_path="src/ai/dataset/destination_review.csv", model_path="ncf_algo.pkl", embedding_dim=32, hidden_layers=[64, 32, 16, 8]):
        self.ratings_path = ratings_path
        self.model_path = model_path
        self.embedding_dim = embedding_dim
        self.hidden_layers = hidden_layers
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._prepare_data()
        self.model = NCF(self.num_users, self.num_items, embedding_dim, hidden_layers).to(self.device)

    def _prepare_data(self):
        df = pd.read_csv(self.ratings_path)
        df['rating'] = df['rating'].astype(int)
        self.user2idx = {user: idx for idx, user in enumerate(df['user_id'].unique())}
        self.item2idx = {item: idx for idx, item in enumerate(df['destination_id'].unique())}
        self.idx2item = {idx: item for item, idx in self.item2idx.items()}
        self.num_users = len(self.user2idx)
        self.num_items = len(self.item2idx)
        df['user_idx'] = df['user_id'].map(self.user2idx)
        df['item_idx'] = df['destination_id'].map(self.item2idx)
        self.df = df

    def train_and_save(self):
        self.train()
        self.save()

    def train(self, epochs=10, lr=0.001, batch_size=256):
        users = torch.tensor(self.df['user_idx'].values, dtype=torch.long)
        items = torch.tensor(self.df['item_idx'].values, dtype=torch.long)
        ratings = torch.tensor(self.df['rating'].values / 5.0, dtype=torch.float)  # Normalize ratings to [0, 1]
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
        # Save the model
        torch.save(self.model.state_dict(), self.model_path)

    def load_model(self):
        self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
        self.model.eval()

    def evaluate(self, n=10):
        """
        Evaluate the NCF model .
        """
        train_df = self.df.sample(frac=0.75, random_state=1)
        test_df = self.df.drop(train_df.index)

        test_users = torch.tensor(test_df['user_idx'].values, dtype=torch.long).to(self.device)
        test_items = torch.tensor(test_df['item_idx'].values, dtype=torch.long).to(self.device)
        test_ratings = test_df['rating'].values

        self.model.eval()
        with torch.no_grad():
            predictions = self.model(test_users, test_items).cpu().numpy()

        rmse = np.sqrt(mean_squared_error(test_ratings, predictions))
        mae = mean_absolute_error(test_ratings, predictions)

        top_n_recommendations = {}
        for user_id in test_df['user_id'].unique():
            user_idx = self.user2idx[user_id]
            user_tensor = torch.tensor([user_idx] * self.num_items, dtype=torch.long).to(self.device)
            item_tensor = torch.arange(self.num_items, dtype=torch.long).to(self.device)
            with torch.no_grad():
                scores = self.model(user_tensor, item_tensor)
            top_items = torch.topk(scores, n).indices.cpu().numpy()
            top_n_recommendations[user_id] = [self.idx2item[idx] for idx in top_items]

        print(f"RMSE: {rmse:.4f}")
        print(f"MAE: {mae:.4f}")
        print("Top-N recommendations have been calculated.")

    def recommend(self, user_id=1, destinations=None):
        user_idx = self.user2idx.get(user_id, None)
        if user_idx is None:
            raise ValueError("Unknown user")
        user_tensor = torch.tensor([user_idx] * self.num_items, dtype=torch.long).to(self.device)
        item_tensor = torch.arange(self.num_items, dtype=torch.long).to(self.device)
        with torch.no_grad():
            scores = self.model(user_tensor, item_tensor)
        top_items = torch.topk(scores, 10).indices.cpu().numpy()
        recommended_destinations = [self.idx2item[idx] for idx in top_items]
        return recommended_destinations

    def run(self, user_id=1, destinations=None):
        if not os.path.exists(self.model_path):
            self.train_and_save()
        else:
            self.load_model()
        return self.recommend(user_id, destinations)
    
# if __name__ == "__main__":
#     # Initialize the RecSysNCF class
#     recsys = RecSysNCF(
#         ratings_path="C:/Users/ADMIN/Downloads/Destination_photo (1)/server/API/src/ai/dataset/destination_review.csv",
#         model_path="C:/Users/ADMIN/Downloads/Destination_photo (1)/server/API/src/ai/ncf_algo.pkl",
#         embedding_dim=32,
#         hidden_layers=[64, 32, 16, 8]
#     )

#     # Train the model and save it to ncf_algo.pkl
#     print("Training the NCF model...")
#     recsys.train_and_save()
#     print("Model training complete and saved to ncf_algo.pkl.")

#     # Test the recommendation system for a specific user
#     user_id = 1  # Example user ID
#     print(f"Getting recommendations for user {user_id}...")
#     recommendations = recsys.run(user_id=user_id)
#     print(f"Top recommendations for user {user_id}: {recommendations}")

