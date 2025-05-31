# -*- coding: utf-8 -*-
"""
Created on Fri May  4 13:08:25 2018

@author: Frank
"""

from surprise import AlgoBase
from surprise import PredictionImpossible
import math
import numpy as np
import heapq
import csv

class ContentKNNAlgorithm(AlgoBase):

    def __init__(self, k=40, sim_options={}):
        AlgoBase.__init__(self)
        self.k = k

    def fit(self, trainset):
        AlgoBase.fit(self, trainset)

        hotel_ids = []
        room_names = {}
        hotel_facilities = {}
        facilities_possessing = {}
        all_room_names = set()

        with open('./dataset/hotel_room_facilities.csv', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                hotel_id = int(row['hotel_id'])
                hotel_ids.append(hotel_id)
                # room_names: dict[hotel_id] = list các phòng
                rooms = row['room_names'].split('|') if row['room_names'] else []
                room_names[hotel_id] = rooms
                all_room_names.update(rooms)
                # hotel_facilities: dict[hotel_id] = list các facility
                hotel_facilities[hotel_id] = [x.strip() for x in row['HotelFacilities'].split(',')] if row['HotelFacilities'] else []
                # facilities_possessing: dict[hotel_id] = list các possessing
                facilities_possessing[hotel_id] = [x.strip() for x in row['FacilitiesPossessing'].split(',')] if row['FacilitiesPossessing'] else []

        # Ánh xạ room_name thành số thứ tự
        room_name2idx = {name: idx for idx, name in enumerate(sorted(all_room_names))}
        # Chuyển room_names thành list số
        room_names_idx = {hid: [room_name2idx[name] for name in names] for hid, names in room_names.items()}

        print("Computing content-based similarity matrix...")
        self.similarities = np.zeros((self.trainset.n_items, self.trainset.n_items))
        
        for thisRating in range(self.trainset.n_items):
            if (thisRating % 100 == 0):
                print(thisRating, " of ", self.trainset.n_items)
            for otherRating in range(thisRating+1, self.trainset.n_items):
                thisHotelID = int(self.trainset.to_raw_iid(thisRating))
                otherHotelID = int(self.trainset.to_raw_iid(otherRating))
                roomNameSim = self.computeRoomNameSimilarity(thisHotelID, otherHotelID, room_names_idx)
                facilitiesSim = self.computeHotelFacilitiesSimilarity(thisHotelID, otherHotelID, hotel_facilities)
                possessingSim = self.computeFacilitiesPossessingSimilarity(thisHotelID, otherHotelID, facilities_possessing)
                self.similarities[thisRating, otherRating] = roomNameSim * facilitiesSim * possessingSim
                self.similarities[otherRating, thisRating] = self.similarities[thisRating, otherRating]
        print("...done.")
        return self


    def computeRoomNameSimilarity(self, hotel1, hotel2, room_names_idx):
        room1 = room_names_idx[hotel1]
        room2 = room_names_idx[hotel2]
        # Nếu không có phòng nào thì trả về 0
        if not room1 or not room2:
            return 0
        # Đảm bảo cùng độ dài (cắt hoặc thêm 0)
        min_len = min(len(room1), len(room2))
        room1 = room1[:min_len]
        room2 = room2[:min_len]
        sumxx, sumxy, sumyy = 0, 0, 0
        for i in range(min_len):
            x = room1[i]
            y = room2[i]
            sumxx += x * x
            sumyy += y * y
            sumxy += x * y
        return sumxy / math.sqrt(sumxx * sumyy) if sumxx > 0 and sumyy > 0 else 0

    def computeHotelFacilitiesSimilarity(self, hotel1, hotel2, hotel_facilities):
        # Sử dụng Jaccard similarity cho tập hợp facilities
        set1 = set(hotel_facilities[hotel1])
        set2 = set(hotel_facilities[hotel2])
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        return intersection / union if union > 0 else 0

    def computeFacilitiesPossessingSimilarity(self, hotel1, hotel2, facilities_possessing):
        # Sử dụng Jaccard similarity cho tập hợp facilities possessing
        set1 = set(facilities_possessing[hotel1])
        set2 = set(facilities_possessing[hotel2])
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        return intersection / union if union > 0 else 0

    def estimate(self, u, i):

        if not (self.trainset.knows_user(u) and self.trainset.knows_item(i)):
            raise PredictionImpossible('User and/or item is unkown.')
        
        # Build up similarity scores between this item and everything the user rated
        neighbors = []
        for rating in self.trainset.ur[u]:
            genreSimilarity = self.similarities[i,rating[0]]
            neighbors.append( (genreSimilarity, rating[1]) )
        
        # Extract the top-K most-similar ratings
        k_neighbors = heapq.nlargest(self.k, neighbors, key=lambda t: t[0])
        
        # Compute average sim score of K neighbors weighted by user ratings
        simTotal = weightedSum = 0
        for (simScore, rating) in k_neighbors:
            if (simScore > 0):
                simTotal += simScore
                weightedSum += simScore * rating
            
        if (simTotal == 0):
            raise PredictionImpossible('No neighbors')

        predictedRating = weightedSum / simTotal

        return predictedRating
