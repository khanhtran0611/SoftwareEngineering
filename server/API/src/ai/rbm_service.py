from flask import Flask, request, jsonify
from bakeRBM import RecSysMain
from bakeNCF import RecSysNCF
from export_csv import export_hotel_room_facilities_to_csv, export_review_user_hotel_rating, export_review_user_destination_rating

# export_hotel_room_facilities_to_csv("C:/Users/ADMIN/Downloads/server/API/src/ai/dataset/hotel_room_facilities.csv")
export_review_user_hotel_rating("C:/Users/ADMIN/Downloads/Destination_photo (1)/server/API/src/ai/dataset/ratings.csv")
export_review_user_destination_rating("C:/Users/ADMIN/Downloads/Destination_photo (1)/server/API/src/ai/dataset/destination_review.csv")
app = Flask(__name__)
recsys = RecSysMain(ratings_path="C:/Users/ADMIN/Downloads/Destination_photo (1)/server/API/src/ai/dataset/ratings.csv")  # chỉ khởi tạo 1 lần
des_recsys = RecSysNCF(
    ratings_path="C:/Users/ADMIN/Downloads/Destination_photo (1)/server/API/src/ai/dataset/destination_review.csv",  # Path to the dataset
    model_path="C:/Users/ADMIN/Downloads/Destination_photo (1)/server/API/src/ai/ncf_algo.pkl",  # Path to the saved model
    embedding_dim=32,
    hidden_layers=[64, 32, 16, 8]
)  # Initialize the RecSysNCF class
des_recsys.train_and_save()
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = data['user_id']
    hotels = data['hotels']
    recs = recsys.run(user_id=user_id, hotels=hotels)
    recs = [[int(hotel_id), float(score)] for hotel_id, score in recs]
    return jsonify(recs)


@app.route('/destination/recommend', methods=['POST'])
def recommend_destination():
    data = request.get_json()
    if 'user_id' not in data:
        return jsonify({"status": 0, "message": "Missing user_id in request body"}), 400
    user_id = data['user_id']
    try:
        # Get top 10 recommended destinations for the user
        recommendations = des_recsys.run(user_id=user_id)
        if recommendations == []:
            return jsonify(recommendations)
        recommendations = [[int(destination_id)] for destination_id in recommendations[:10]]
        print(recommendations)
        return jsonify(recommendations)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001)