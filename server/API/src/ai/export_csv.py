import csv
import psycopg2

db_config = {
'host': 'localhost',
'dbname': 'softwareengineering2',
'user': 'postgres',
'password': 'admin',
'port': 5432
}

def export_hotel_room_facilities_to_csv(filename):
    """
    Export hotel_id, room (name), HotelFacilities, FacilitiesPossessing from Postgres to CSV.
    Các phòng của cùng một khách sạn sẽ được gộp lại, phân tách bằng '|'.

    Args:
        filename (str): Output CSV file path.
    """
    query = """
    SELECT
        h.hotel_id,
        r.name AS room_name,
        STRING_AGG(DISTINCT hf.name, ', ') AS HotelFacilities,
        STRING_AGG(DISTINCT fp.description, ', ') AS FacilitiesPossessing
    FROM Hotel h
    JOIN Room r ON h.hotel_id = r.hotel_id
    LEFT JOIN FacilitiesPossessing fp ON fp.hotel_id = h.hotel_id
    LEFT JOIN HotelFacilities hf ON hf.facility_id = fp.facility_id
    GROUP BY h.hotel_id, r.name
    ORDER BY h.hotel_id, r.name
    """
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()
    cur.execute(query)
    rows = cur.fetchall()
    # Gộp các phòng cùng hotel_id
    hotel_dict = {}
    for hotel_id, room_name, hotel_fac, fac_pos in rows:
        if hotel_id not in hotel_dict:
            hotel_dict[hotel_id] = {
                "room_names": [],
                "HotelFacilities": hotel_fac,
                "FacilitiesPossessing": fac_pos
            }
        hotel_dict[hotel_id]["room_names"].append(room_name)
    with open(filename, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['hotel_id', 'room_names', 'HotelFacilities', 'FacilitiesPossessing'])
        for hotel_id, info in hotel_dict.items():
            room_names_joined = '|'.join(info["room_names"])
            writer.writerow([hotel_id, room_names_joined, info["HotelFacilities"], info["FacilitiesPossessing"]])
    cur.close()
    conn.close()

def export_review_user_hotel_rating(filename):
    """
    Export user_id, hotel_id, rating from Review table to CSV.

    Args:
        filename (str): Output CSV file path.
    """
    query = """
    SELECT user_id, hotel_id, rating
    FROM review
    ORDER BY user_id, hotel_id
    """
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()
    cur.execute(query)
    rows = cur.fetchall()
    with open(filename, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['user_id', 'hotel_id', 'rating'])
        for row in rows:
            writer.writerow(row)
    cur.close()
    conn.close()

def export_review_user_destination_rating(filename):
    """
    Export user_id, destination_id, rating from destination_review table to CSV.

    Args:
        filename (str): Output CSV file path.
    """
    query = """
    SELECT user_id, destination_id, rating
    FROM desreview
    ORDER BY user_id, destination_id
    """
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()
    cur.execute(query)
    rows = cur.fetchall()
    with open(filename, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['user_id', 'destination_id', 'rating'])
        for row in rows:
            writer.writerow(row)
    cur.close()
    conn.close()

if __name__ == "__main__":
    export_hotel_room_facilities_to_csv('./dataset/hotel_room_facilities.csv')
    export_review_user_destination_rating('./dataset/destination_review.csv')
    #export_review_user_hotel_rating('./dataset/ratings.csv')