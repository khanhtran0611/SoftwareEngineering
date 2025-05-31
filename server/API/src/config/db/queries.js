const RoleExtract ="SELECT role FROM \"User\" WHERE user_id = $1;"
const viewOrderHistory = "SELECT b.booking_id, h.hotel_id, h.name AS hotel_name, r.room_id, r.name AS room_name, b.status, b.total_price, b.check_in_date, b.check_out_date FROM Booking b JOIN Room r ON b.room_id = r.room_id JOIN Hotel h ON r.hotel_id = h.hotel_id WHERE b.user_id = $1;"
const viewDestination = "SELECT destination_id,name,rating,location,description,thumbnail FROM Destination;"
const viewDestinationAll = "SELECT * FROM Destination where destination_id = $1;"
const viewHotel = "SELECT h.hotel_id,h.name,h.rating,h.description FROM Hotel h JOIN HotelNearby ha ON h.hotel_id = ha.hotel_id JOIN Destination d ON ha.destination_id = d.destination_id WHERE d.destination_id = $1;"
const viewHotelInfo = "SELECT * FROM Hotel WHERE hotel_id = $1;"
const addComment = "INSERT INTO Review (user_id, hotel_id, rating, comment, date_created) VALUES ($1, $2, $3, $4, NOW()) RETURNING *;"
const addDestinationComment = "INSERT INTO DesReview (user_id, destination_id, rating, comment, date_created) VALUES ($1, $2, $3, $4, NOW());"
const BookingStatusChange = "UPDATE Booking SET status = $2 WHERE booking_id = $1 RETURNING *;"
const CancelBooking = "UPDATE Booking SET status = 'cancelled' WHERE booking_id = $1; "
const BookingRoom = "INSERT INTO Booking (user_id, room_id, status, total_price, check_in_date, check_out_date,people) VALUES ($1, $2, 'pending', $3, $4, $5,$6) RETURNING *;"
const viewProfile = "SELECT * FROM \"User\" WHERE user_id = $1;"
const viewComment = "SELECT * FROM Review WHERE hotel_id = $1";
const ViewDestinationComment = "SELECT * FROM DesReview WHERE destination_id = $1";
const editProfile = "UPDATE \"User\" SET name = $1, email = $2, phone_number = $3, gender = $4, date_of_birth = $5, profile_image = $6 WHERE user_id = $7 RETURNING *;"
const PriceExtract = "SELECT price_per_night FROM Room WHERE room_id = $1;"
const editBooking = "UPDATE Booking SET room_id = $2, total_price = $3, check_in_date = $4, check_out_date = $5, status = $6, people = $7 WHERE booking_id = $1 RETURNING *;"
const signin = "INSERT INTO \"User\" (name, email, phone_number, gender, date_of_birth, role, password) VALUES ($1, $2, $3, $4, $5, 'customer', $6);"
const AddLovingList = "INSERT INTO LovingList (user_id, destination_id) VALUES ($1, $2);"
const DeleteLovingList = "DELETE FROM LovingList WHERE user_id = $1 AND destination_id = $2;"
const ViewLovingList = "SELECT d.destination_id FROM LovingList l JOIN Destination d ON l.destination_id = d.destination_id WHERE l.user_id = $1;"
const DestinationImage = "SELECT image_url from Image where destination_id = $1;"
const TypeBrowse = "SELECT * FROM destination WHERE type = $1;"
const LocationBrowse = "SELECT * FROM destination WHERE location = $1;"
const FeeBrowse = "SELECT * FROM destination WHERE entry_fee BETWEEN $1 AND $2;"
const ViewRoomInfo = "SELECT * FROM Room WHERE room_id = $1;"
const ViewHotelRooms = "SELECT * FROM Room WHERE hotel_id = $1;"
const login = "SELECT * FROM \"User\" WHERE email = $1 AND password = $2;"
const ListofFacilities = "SELECT f.facility_id, f.name, fp.description FROM FacilitiesPossessing fp JOIN HotelFacilities f ON fp.facility_id = f.facility_id WHERE fp.hotel_id = $1;"
const ListofServices = "SELECT s.service_id, s.name FROM ServicePossessing sp JOIN RoomService s ON sp.service_id = s.service_id WHERE sp.room_id = $1;"
const createHotel = "INSERT INTO Hotel (name, address, rating, longitude, latitude, description, thumbnail,contact_phone,user_id) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) RETURNING *;"
const ViewBooking = "SELECT b.*,u.name as guest_name,h.name as hotel_name,r.name as room_name FROM Hotel h JOIN Room r ON (h.hotel_id = r.hotel_id) JOIN booking b ON (r.room_id = b.room_id) JOIN \"User\" u ON (b.user_id = u.user_id) WHERE h.user_id = $1;"
const getAllHotels = "SELECT * FROM Hotel WHERE user_id = $1;"
const getHotelForRoom = `
    SELECT h.*
    FROM Hotel h
    JOIN Room r ON h.hotel_id = r.hotel_id
    WHERE r.room_id = $1;
`

const UpdateFacility = `
    UPDATE FacilitiesPossessing
    SET description = $3
    WHERE facility_id = $1 AND hotel_id = $2
    RETURNING *;
`
const DeleteFacility = `
    DELETE FROM FacilitiesPossessing
    WHERE facility_id = $1 AND hotel_id = $2
    RETURNING *;
`

const DeleteService = `
    DELETE FROM ServicePossessing
    WHERE service_id = $1 AND room_id = $2
    RETURNING *;
`

const removeHotel = "DELETE FROM Hotel WHERE hotel_id = $1 RETURNING *;"

const removeRoom = "DELETE FROM Room WHERE room_id = $1 RETURNING *;"

const getDestinationComment= `
   SELECT * FROM Review WHERE destination_id = $1;
`
const editDestinationComment = `
  UPDATE DesReview 
  SET rating = $2, comment = $3, date_created = NOW()
  WHERE user_id = $1 AND destination_id = $2
  RETURNING *;
`

const deleteDestinationComment = `
  DELETE FROM DesReview WHERE user_id = $1 AND destination_id = $2
  RETURNING *;
`

const CheckHotelReview = `
    SELECT * FROM Review WHERE user_id = $1 AND hotel_id = $2;
`

const Browse = `
  SELECT * FROM destination 
  WHERE name LIKE '%' || $1 || '%' 
    AND entry_fee BETWEEN $2 AND $3 
    AND location LIKE '%' || $4 || '%';
`;

const CheckLovingList = `
  SELECT * FROM LovingList WHERE user_id = $1 AND destination_id = $2;
`

const getHotelDetail = `
    SELECT h.*, 
           ARRAY_AGG(DISTINCT r.room_id || ',' || r.name || ',' || r.type || ',' || COALESCE(r.thumbnail, '')  || ',' || r.price_per_night::text) as rooms,
           ARRAY_AGG(DISTINCT f.facility_id || ',' || f.name || ',' || fp.description) as facilities
    FROM Hotel h
    LEFT JOIN Room r ON h.hotel_id = r.hotel_id
    LEFT JOIN FacilitiesPossessing fp ON h.hotel_id = fp.hotel_id
    LEFT JOIN HotelFacilities f ON fp.facility_id = f.facility_id
    WHERE h.hotel_id = $1
    GROUP BY h.hotel_id;
`

const viewBookingDetail = `
    SELECT * FROM Booking WHERE booking_id = $1;
`
const updateHotel = `
    UPDATE Hotel 
    SET name = $2,
        address = $3,
        rating = $4,
        longitude = $5,
        latitude = $6,
        description = $7,
        thumbnail = $8,
        contact_phone = $9
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
    SET name = $2,
        type = $3,
        location = $4,
        availability = $5,
        max_guests = $6,
        price_per_night = $7,
        description = $8,
        thumbnail = $9
    WHERE room_id = $1
    RETURNING *;
`

const getRoomById = `
    SELECT r.*, h.name as hotel_name, 
           ARRAY_AGG(DISTINCT s.service_id || ',' || s.name) as services
    FROM Room r
    JOIN Hotel h ON r.hotel_id = h.hotel_id
    LEFT JOIN ServicePossessing sp ON r.room_id = sp.room_id
    LEFT JOIN RoomService s ON sp.service_id = s.service_id
    WHERE r.room_id = $1
    GROUP BY r.room_id, h.name;
`
const ViewRoom = `
    SELECT r.*, h.name as hotel_name, 
           ARRAY_AGG(DISTINCT s.service_id || ',' || s.name) as services
    FROM Room r
    JOIN Hotel h ON r.hotel_id = h.hotel_id
    LEFT JOIN ServicePossessing sp ON r.room_id = sp.room_id
    LEFT JOIN RoomService s ON sp.service_id = s.service_id
    WHERE r.room_id = $1
    GROUP BY r.room_id, h.name;
`

const ViewPendingBooking = "SELECT * FROM BOOKING WHERE status = 'pending';"

const ViewCancelBooking = "SELECT * FROM BOOKING WHERE status = 'cancel_requested';"

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
    SET status = 'rejected'
    WHERE booking_id = $1 AND status = 'pending'
    RETURNING *;
`

// Queries cho destination management
const addDestination = `
    INSERT INTO Destination (
        name, rating, location, transportation, 
        entry_fee, description, latitude, longitude,type,
        thumbnail
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)
    RETURNING *;
`

const updateDestination = `
    UPDATE Destination 
    SET name = $2,
        rating = $3,
        location = $4,
        transportation = $5,
        entry_fee = $6,
        description = $7,
        latitude = $8,
        longitude = $9,
        thumbnail = $10,
        type = $11
    WHERE destination_id = $1
    RETURNING *;
`

const deleteDestination = `
    DELETE FROM Destination 
    WHERE destination_id = $1 
    RETURNING *;
`

// SELECT d.*,
// ARRAY_AGG(DISTINCT i.image_url) as images,
// ARRAY_AGG(DISTINCT h.hotel_id || ',' || h.name || ',' || h.rating) as nearby_hotels
// FROM Destination d
// LEFT JOIN Image i ON d.destination_id = i.destination_id
// LEFT JOIN Hotelnearby ha ON d.destination_id = ha.destination_id
// LEFT JOIN Hotel h ON ha.hotel_id = h.hotel_id
// WHERE d.destination_id = $1
// GROUP BY d.destination_id;
const getDestinationDetail = `
   SELECT * FROM Destination WHERE destination_id = $1;
`

//    (SELECT COUNT(*) FROM LovingList l WHERE l.destination_id = d.destination_id) as favorite_count
//     ORDER BY d.destination_id;
const getAllDestinations = `
    SELECT *
    FROM Destination d;
`

const getNearbyDestination = `
    SELECT * FROM HotelArround WHERE hotel_id = $1;
`

const getHotelByUserId = `
    SELECT * FROM Hotel WHERE user_id = $1;
`

const addDestinationImage = `
    INSERT INTO Image (destination_id, image_url)
    VALUES ($1, $2)
    RETURNING *;
`

const removeDestinationImage = `
    DELETE FROM Image 
    WHERE image_id = $1
    RETURNING *;
`

const updateDestinationImage = `
    UPDATE Image 
    SET image_url = $2
    WHERE image_id = $1
    RETURNING *;
`

const UpdateFacilityForHotel = `
    INSERT INTO FacilitiesPossessing
    VALUES ($1,$2,$3);
`
const DeleteFacilityForHotel = `
    DELETE FROM FacilitiesPossessing
    WHERE facility_id = $1 AND hotel_id = $2;
`
const UpdateServiceForRoom = `
    INSERT INTO ServicePossessing
    VALUES ($1,$2);
`

const DeleteServiceForRoom = `
    DELETE FROM ServicePossessing
    WHERE service_id = $1 AND room_id = $2;
`

const insertFacility = `
    INSERT INTO hotelfacilities VALUES($1,$2); 
`
const viewfacility = `
    SELECT * FROM FacilitiesPossessing WHERE hotel_id = $1;  
`
const getHotelFacilities = `
    SELECT hf.facility_id,hf.name,fp.description 
    FROM facilitiespossessing fp JOIN HotelFacilities hf ON fp.facility_id = hf.facility_id 
    WHERE fp.hotel_id = $1;
`

const insertService = `
    INSERT INTO RoomService
    VALUES($1,$2);
`

const viewService = `
    SELECT * FROM ServicePossessing WHERE room_id = $1;
`

const getRoomServices = `
    SELECT s.service_id,s.name 
    FROM Servicepossessing sp JOIN RoomService s ON sp.service_id = s.service_id 
    WHERE sp.room_id = $1;
`

const getRoomStatus = `
    SELECT status FROM room WHERE room_id = $1;
`
const getDestinationImages = `
    SELECT * FROM Image WHERE destination_id = $1;
`

const getDestinationLocation = `
    SELECT destination_id,latitude,longitude FROM Destination;
`

const getHotelRating = `
    SELECT rating FROM Review WHERE hotel_id = $1; 
`

const getDestinationRating = `
    SELECT rating FROM DesReview WHERE destination_id = $1;
`

const getRoomDetail = `
    SELECT * FROM Room WHERE room_id = $1;
`
//  dr.rating, dr.comment, dr.date_created
const getUserFromDestinationReview = `
SELECT u.user_id, u.name, u.email, u.profile_image, u.role
FROM DesReview dr
JOIN "User" u ON dr.user_id = u.user_id
WHERE dr.destination_id = $1
ORDER BY dr.date_created DESC
`;

const getFullHotels = `
    SELECT * FROM Hotel;
`

const checkDestinationReview = `
    SELECT * FROM DesReview WHERE user_id = $1 AND destination_id = $2;
`
const getRoomListFromRoomId = `
    SELECT * FROM Room 
    WHERE hotel_id IN (SELECT hotel_id FROM room r2 WHERE r2.room_id = $1);
`

const getAllFacilities = `
    SELECT * FROM HotelFacilities;
`

const getAllServices = `
    SELECT * FROM RoomService;
`

const updateRoomStatus = `
    UPDATE Room 
    SET availability = $2
    WHERE room_id = $1
    RETURNING *;
`

module.exports = {
    viewOrderHistory,
    getUserFromDestinationReview,
    checkDestinationReview,
    viewDestination,
    viewDestinationAll,
    viewHotel,
    addComment,
    UpdateFacility,
    BookingStatusChange,
    CancelBooking,
    BookingRoom,
    removeRoom,
    RoleExtract,
    viewComment,
    getDestinationComment,
    editProfile,
    viewProfile,
    PriceExtract,
    editBooking,
    signin,
    DeleteFacility,
    DeleteService,
    AddLovingList,
    DeleteLovingList,
    ViewLovingList,
    DestinationImage,
    TypeBrowse,
    LocationBrowse,
    FeeBrowse,
    Browse,
    editDestinationComment,
    deleteDestinationComment,
    viewHotelInfo,
    ViewRoomInfo,
    getHotelByUserId,
    ViewHotelRooms,
    getRoomListFromRoomId,
    login,
    createHotel,
    CheckLovingList,
    getAllHotels,
    ViewBooking,
    removeHotel,
    getHotelDetail,
    updateHotel,
    addRoom,
    addDestinationComment,
    CheckHotelReview,
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
    removeDestinationImage,
    ListofFacilities,
    ListofServices,
    UpdateFacilityForHotel,
    DeleteFacilityForHotel,
    UpdateServiceForRoom,
    DeleteServiceForRoom,
    insertFacility,
    insertService,
    viewfacility,
    viewService,
    ViewRoom,
    getHotelRating,
    getDestinationRating,
    ViewPendingBooking,
    ViewCancelBooking,
    getRoomStatus,
    getHotelFacilities,
    getRoomServices,
    getNearbyDestination,
    getDestinationImages,
    getDestinationLocation,
    ViewDestinationComment,
    viewBookingDetail,
    getRoomDetail,
    getFullHotels,
    getHotelForRoom,
    getAllFacilities,
    getAllServices,
    updateDestinationImage,
    updateRoomStatus
}