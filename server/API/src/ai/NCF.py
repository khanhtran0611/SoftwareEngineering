import torch
import torch.nn as nn

class NCF(nn.Module):
    """
    Neural Collaborative Filtering (NCF) model for recommendation systems.
    This model is designed to predict ratings for holiday destinations based on user preferences.
    """
    def __init__(self, num_users, num_items, embedding_dim=32, hidden_layers=[64, 32, 16, 8]):
        super(NCF, self).__init__()
        # Embedding layers for users and destinations
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)

        # Multi-Layer Perceptron (MLP) for learning interactions between users and destinations
        mlp_layers = []
        input_size = embedding_dim * 2  # Concatenated user and item embeddings
        for h in hidden_layers:
            mlp_layers.append(nn.Linear(input_size, h))
            mlp_layers.append(nn.ReLU())
            input_size = h
        self.mlp = nn.Sequential(*mlp_layers)

        # Output layer for predicting the rating
        self.output = nn.Linear(input_size, 1)
        self.sigmoid = nn.Sigmoid()  # Sigmoid activation for binary ratings (scaled between 0 and 1)

    def forward(self, user_indices, item_indices):
        """
        Forward pass for the NCF model.

        Args:
            user_indices (Tensor): Tensor of user indices.
            item_indices (Tensor): Tensor of destination indices.

        Returns:
            Tensor: Predicted ratings for the given user-destination pairs.
        """
        # Get embeddings for users and destinations
        user_emb = self.user_embedding(user_indices)
        item_emb = self.item_embedding(item_indices)

        # Concatenate embeddings and pass through the MLP
        x = torch.cat([user_emb, item_emb], dim=-1)
        x = self.mlp(x)

        # Predict the rating and apply sigmoid activation
        x = self.output(x)
        x = self.sigmoid(x)
        return x.squeeze()