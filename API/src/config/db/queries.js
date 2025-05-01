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
const createHotel = "INSERT INTO Hotel (name, address, rating, longitude, latitude, description, thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;"
const getAllHotels = "SELECT * FROM Hotel;"
const removeHotel = "DELETE FROM Hotel WHERE hotel_id = $1 RETURNING *;"
const getHotelDetail = `
    SELECT h.*, 
           ARRAY_AGG(DISTINCT r.room_id || ',' || r.name || ',' || r.type || ',' || r.price_per_night::text || ',' || COALESCE(r.thumbnail, '')) as rooms,
           ARRAY_AGG(DISTINCT f.facility_id || ',' || f.name || ',' || fp.description) as facilities
    FROM Hotel h
    LEFT JOIN Room r ON h.hotel_id = r.hotel_id
    LEFT JOIN FacilitiesPossessing fp ON h.hotel_id = fp.hotel_id
    LEFT JOIN HotelFacilities f ON fp.facility_id = f.facility_id
    WHERE h.hotel_id = $1
    GROUP BY h.hotel_id;
`
const updateHotel = `
    UPDATE Hotel 
    SET name = COALESCE($2, name),
        address = COALESCE($3, address),
        rating = COALESCE($4, rating),
        longitude = COALESCE($5, longitude),
        latitude = COALESCE($6, latitude),
        description = COALESCE($7, description),
        thumbnail = COALESCE($8, thumbnail)
    WHERE hotel_id = $1
    RETURNING *;
`

// Thêm queries cho phòng
const addRoom = `
    INSERT INTO Room (hotel_id, name, type, location, availability, max_guests, price_per_night, description, thumbnail)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
`

const updateRoom = `
    UPDATE Room 
    SET name = COALESCE($2, name),
        type = COALESCE($3, type),
        location = COALESCE($4, location),
        availability = COALESCE($5, availability),
        max_guests = COALESCE($6, max_guests),
        price_per_night = COALESCE($7, price_per_night),
        description = COALESCE($8, description),
        thumbnail = COALESCE($9, thumbnail)
    WHERE room_id = $1
    RETURNING *;
`

const getRoomById = `
    SELECT r.*, h.name as hotel_name, 
           ARRAY_AGG(DISTINCT s.service_id || ',' || s.name || ',' || sp.description) as services
    FROM Room r
    JOIN Hotel h ON r.hotel_id = h.hotel_id
    LEFT JOIN ServicePossessing sp ON r.room_id = sp.room_id
    LEFT JOIN RoomService s ON sp.service_id = s.service_id
    WHERE r.room_id = $1
    GROUP BY r.room_id, h.name;
`

// Thêm queries cho booking
const getBookingDetail = `
    SELECT b.*, 
           u.name as user_name, u.email as user_email,
           r.name as room_name, r.type as room_type,
           h.name as hotel_name, h.address as hotel_address
    FROM Booking b
    JOIN "User" u ON b.user_id = u.user_id
    JOIN Room r ON b.room_id = r.room_id
    JOIN Hotel h ON r.hotel_id = h.hotel_id
    WHERE b.booking_id = $1;
`

const acceptBooking = `
    UPDATE Booking 
    SET status = 'Confirmed'
    WHERE booking_id = $1 AND status = 'Pending'
    RETURNING *;
`

const rejectBooking = `
    UPDATE Booking 
    SET status = 'Rejected'
    WHERE booking_id = $1 AND status = 'Pending'
    RETURNING *;
`

// Queries cho destination management
const addDestination = `
    INSERT INTO Destination (
        name, rating, location, transportation, 
        entry_fee, description, latitude, longitude,
        thumbnail
    ) VALUES ($1, $2, $3, $4, CAST($5 AS MONEY), $6, $7, $8, $9)
    RETURNING *;
`

const updateDestination = `
    UPDATE Destination 
    SET name = COALESCE($2, name),
        rating = COALESCE($3, rating),
        location = COALESCE($4, location),
        transportation = COALESCE($5, transportation),
        entry_fee = COALESCE($6, entry_fee),
        description = COALESCE($7, description),
        latitude = COALESCE($8, latitude),
        longitude = COALESCE($9, longitude),
        thumbnail = COALESCE($10, thumbnail),
        type = COALESCE($11, type)
    WHERE destination_id = $1
    RETURNING *;
`

const deleteDestination = `
    DELETE FROM Destination 
    WHERE destination_id = $1 
    RETURNING *;
`

const getDestinationDetail = `
    SELECT d.*,
           ARRAY_AGG(DISTINCT i.image_url) as images,
           ARRAY_AGG(DISTINCT h.hotel_id || ',' || h.name || ',' || h.rating) as nearby_hotels
    FROM Destination d
    LEFT JOIN Image i ON d.destination_id = i.destination_id
    LEFT JOIN HotelArround ha ON d.destination_id = ha.destination_id
    LEFT JOIN Hotel h ON ha.hotel_id = h.hotel_id
    WHERE d.destination_id = $1
    GROUP BY d.destination_id;
`

const getAllDestinations = `
    SELECT d.*,
           (SELECT COUNT(*) FROM Review r WHERE r.destination_id = d.destination_id) as review_count,
           (SELECT COUNT(*) FROM LovingList l WHERE l.destination_id = d.destination_id) as favorite_count
    FROM Destination d
    ORDER BY d.destination_id;
`

const addDestinationImage = `
    INSERT INTO Image (destination_id, image_url)
    VALUES ($1::integer, $2)
    RETURNING *;
`

const removeDestinationImage = `
    DELETE FROM Image 
    WHERE destination_id = $1 AND image_url = $2
    RETURNING *;
`

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
    login,
    createHotel,
    getAllHotels,
    removeHotel,
    getHotelDetail,
    updateHotel,
    addRoom,
    updateRoom,
    getRoomById,
    getBookingDetail,
    acceptBooking,
    rejectBooking,
    addDestination,
    updateDestination,
    deleteDestination,
    getDestinationDetail,
    getAllDestinations,
    addDestinationImage,
    removeDestinationImage
}