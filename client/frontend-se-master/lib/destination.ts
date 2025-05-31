// Định nghĩa các API functions:
import { api } from '@/lib/api';
import { fileApi } from '@/lib/api';
import { Destination } from '@/types/destination';


// 1. Lấy tất cả destinations
export async function getAllDestinations() {
    try {
        const response = await api.get('/destinations')
        return response.data
    } catch (error) {
        throw error
    }
}

// 2. Lấy destination theo ID 
export async function getDestinationById(destinationId: number) {
    try {
        console.log(typeof destinationId)
        const response = await api.get(`/destinations/${destinationId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

// 3. Lấy destinations theo filter
export async function getFilteredDestinations(filters: {
    searchQuery: string,
    minPrice: number,
    maxPrice: number,
    location: string
}) {
    try {
        let response = await api.get(`/destinations/api/filter?name=${filters.searchQuery}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&location=${filters.location}`);
        return response.data
    } catch (error) {
        throw error
    }
}

// 4. Tạo destination mới
export async function createDestination(destinationData: Omit<Destination, "destination_id" | "rating">) {
    try {
        console.log(destinationData)
        const response = await api.post('/destinations', destinationData)
        return response.data
    } catch (error) {
        throw error
    }
}

// 5. Cập nhật destination
export async function updateDestination(destinationData: Destination) {
    try {
        const response = await api.put(`/destinations/${destinationData.destination_id}`, destinationData)
        return response.data
    } catch (error) {
        throw error
    }
}

// 6. Xóa destination
export async function deleteDestination(destinationId: number) {
    try {
        const response = await api.delete(`/destinations/${destinationId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export async function uploadDestinationImages(file: File) {
    try {
        let formData = new FormData()
        formData.append('image', file)
        const response = await fileApi.post('/destinations/upload-destination-image', formData)
        return response
    } catch (error) {
        throw error
    }
}

export async function deleteDestinationImage(filename: string) {
    try {
        const response = await api.delete(`/destinations/delete-destination-image/${filename.replace('/destination/', '')}`)
        return response
    } catch (error) {
        throw error
    }
}


export async function createDestinationImageRecord(data: { destination_id: number, image_url: string }) {
    try {
        console.log(data.image_url)
        const response = await api.post(`/destinations/create-destination-image/`, data)
        return response
    } catch (error) {
        throw error
    }
}

export async function updateDestinationImage(imageId: number, data: { image_url: string }) {
    try {
        const response = await api.put(`/destinations/update-destination-image-db/${imageId}`, data)
        return response
    } catch (error) {
        throw error
    }
}

export async function deleteDestinationImageonDB(imageId: number) {
    try {
        const response = await api.delete(`/destinations/delete-destination-image-db/${imageId}`)
        return response
    } catch (error) {
        throw error
    }
}   
