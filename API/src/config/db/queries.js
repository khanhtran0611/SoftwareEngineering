const RoleExtract ="SELECT role FROM \"User\" WHERE user_id = $1;"
const viewOrderHistory = "SELECT b.booking_id, h.hotel_id, h.name AS hotel_name, r.name AS room_name, b.status, b.total_price, b.check_in_date, b.check_out_date FROM Booking b JOIN Room r ON b.room_id = r.room_id JOIN Hotel h ON r.hotel_id = h.hotel_id WHERE b.user_id = $1;"
const viewDestination = "SELECT destination_id,name,rating,location,description,thumbnail FROM Destination;"
const viewDestinationAll = "SELECT * FROM Destination where destination_id = $1;"
const viewHotel = "SELECT h.hotel_id,h.name,h.rating,h.description FROM Hotel h JOIN HotelNearby ha ON h.hotel_id = ha.hotel_id JOIN Destination d ON ha.destination_id = d.destination_id WHERE d.destination_id = $1;"
const viewHotelInfo = "SELECT * FROM Hotel WHERE hotel_id = $1;"
const addComment = "INSERT INTO Review (user_id, destination_id, rating, comment, date_created) VALUES ($1, $2, $3, $4, NOW());"
const RequestcancelBooking = "UPDATE Booking SET status = 'Cancel_Requested' WHERE booking_id = $1;"
const CancelBooking = "UPDATE Booking SET status = 'Cancelled' WHERE booking_id = $1; "
const BookingRoom = "INSERT INTO Booking (user_id, room_id, status, total_price, check_in_date, check_out_date) VALUES ($1, $2, 'Pending', $3, $4, $5);"
const editProfile = "UPDATE \"User\" SET name = $1, email = $2, phone_number = $3, gender = $4, date_of_birth = $5, role = $6, password = $7 WHERE user_id = $8;"
const PriceExtract = "SELECT price_per_night FROM Room WHERE room_id = $1;"
const editBooking = "UPDATE Booking SET room_id = $2, total_price = $3, check_in_date = $4, check_out_date = $5, status = $6 WHERE booking_id = $1;"
const signin = "INSERT INTO \"User\" (name, email, phone_number, gender, date_of_birth, role, password) VALUES ($1, $2, $3, $4, $5, 'customer', $6);"
const AddLovingList = "INSERT INTO LovingList (user_id, destination_id) VALUES ($1, $2);"
const DeleteLovingList = "DELETE FROM LovingList WHERE user_id = $1 AND destination_id = $2;"
const ViewLovingList = "SELECT d.* FROM LovingList l JOIN Destination d ON l.destination_id = d.destination_id WHERE l.user_id = $1;"
const DestinationImage = "SELECT image_url from Image where destination_id = $1;"
const TypeBrowse = "SELECT * FROM destination WHERE type = $1;"
const LocationBrowse = "SELECT * FROM destination WHERE location = $1;"
const FeeBrowse = "SELECT * FROM destination WHERE entry_fee BETWEEN $1 AND $2;"
const ViewRoomInfo = "SELECT * FROM Room WHERE room_id = $1;"
const ViewHotelRooms = "SELECT room_id,name,type,price_per_night,thumbnail FROM Room WHERE hotel_id = $1;"
const login = "SELECT user_id,name,profile_image FROM \"User\" WHERE email = $1 AND password = $2;"
module.exports = {
    viewOrderHistory,
    viewDestination,
    viewDestinationAll,
    viewHotel,
    addComment,
    RequestcancelBooking,
    CancelBooking,
    BookingRoom,
    RoleExtract,
    editProfile,
    PriceExtract,
    editBooking,
    signin,
    AddLovingList,
    DeleteLovingList,
    ViewLovingList,
    DestinationImage,
    TypeBrowse,
    LocationBrowse,
    FeeBrowse,
    viewHotelInfo,
    ViewRoomInfo,
    ViewHotelRooms,
    login
}