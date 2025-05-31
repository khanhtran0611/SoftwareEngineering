from flask import Flask, request, jsonify
from bakeRBM import RecSysMain

app = Flask(__name__)
recsys = RecSysMain(ratings_path="src/ai/dataset/ratings.csv")  # chỉ khởi tạo 1 lần

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = data['user_id']
    hotels = data['hotels']
    recs = recsys.run(user_id=user_id, hotels=hotels)
    recs = [[int(hotel_id), float(score)] for hotel_id, score in recs]
    return jsonify(recs)

if __name__ == '__main__':
    app.run(port=5001)