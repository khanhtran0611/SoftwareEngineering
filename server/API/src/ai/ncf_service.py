from flask import Flask, request, jsonify
from bakeNCF import RecSysNCF

app = Flask(__name__)
recsys = RecSysNCF(
    ratings_path="src/ai/dataset/destination_review.csv",  # Path to the dataset
    model_path="../src/ai/ncf_algo.pkl",  # Path to the saved model
    embedding_dim=32,
    hidden_layers=[64, 32, 16, 8]
)  # Initialize the RecSysNCF class

@app.route('/destination/recommend', methods=['POST'])
def recommend_destination():
    data = request.get_json()
    user_id = data['user_id']
    try:
        # Get top 10 recommended destinations for the user
        recommendations = recsys.run(user_id=user_id)
        return jsonify(recommendations)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5002)