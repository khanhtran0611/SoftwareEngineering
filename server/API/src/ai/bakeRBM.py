import os
import numpy as np
import pandas as pd
from surprise import Dataset, Reader
from surprise.model_selection import train_test_split
from surprise import accuracy
from RBMAlgorithm import RBMAlgorithm
from RecommenderMetrics import RecommenderMetrics

from surprise.model_selection import LeaveOneOut
from surprise import KNNBaseline

def Evaluated(algo, data, n=5):

    fullTrainSet = data.build_full_trainset()
    fullAntiTestSet = fullTrainSet.build_anti_testset()
    
    #Build a "leave one out" train/test split for evaluating top-N recommenders
    #And build an anti-test-set for building predictions
    LOOCV = LeaveOneOut(n_splits=1, random_state=1)
    for train, test in LOOCV.split(data):
        LOOCVTrain = train
        LOOCVTest = test
        
    LOOCVAntiTestSet = LOOCVTrain.build_anti_testset()
    sim_options = {'name': 'cosine', 'user_based': False}
    simsAlgo = KNNBaseline(sim_options=sim_options)
    simsAlgo.fit(fullTrainSet)

    metrics = {}
    trainset, testset = train_test_split(data, test_size=0.25, random_state=1)
    algo.fit(trainset)
    predictions = algo.test(testset)
    # rmse = accuracy.rmse(predictions, verbose=True)
    # mae = accuracy.mae(predictions, verbose=True)
    metrics["RMSE"] = RecommenderMetrics.RMSE(predictions)
    metrics["MAE"] = RecommenderMetrics.MAE(predictions)

    algo.fit(LOOCVTrain)
    leftOutPredictions = algo.test(LOOCVTest)        
    # Build predictions for all ratings not in the training set
    allPredictions = algo.test(LOOCVAntiTestSet)
    # Compute top 10 recs for each user
    topNPredicted = RecommenderMetrics.GetTopN(allPredictions, n)
    # See how often we recommended a movie the user actually rated
    metrics["HR"] = RecommenderMetrics.HitRate(topNPredicted, leftOutPredictions)   
    # See how often we recommended a movie the user actually liked
    metrics["cHR"] = RecommenderMetrics.CumulativeHitRate(topNPredicted, leftOutPredictions)
    # Compute ARHR
    metrics["ARHR"] = RecommenderMetrics.AverageReciprocalHitRank(topNPredicted, leftOutPredictions)

    
    print("{:<10} {:<10} {:<10} {:<10} {:<10}".format(
            "RMSE", "MAE", "HR", "cHR", "ARHR"))
    print("{:<10.4f} {:<10.4f} {:<10.4f} {:<10.4f} {:<10.4f}".format(
            metrics["RMSE"], metrics["MAE"], metrics["HR"], metrics["cHR"], metrics["ARHR"]))
    print("\nLegend:\n")
    print("RMSE:      Root Mean Squared Error. Lower values mean better accuracy.")
    print("MAE:       Mean Absolute Error. Lower values mean better accuracy.")
    print("HR:        Hit Rate; how often we are able to recommend a left-out rating. Higher is better.")
    print("cHR:       Cumulative Hit Rate; hit rate, confined to ratings above a certain threshold. Higher is better.")
    print("ARHR:      Average Reciprocal Hit Rank - Hit rate that takes the ranking into account. Higher is better.\n" )

def recommend_for_user(algo, data, Subject=1):
    testSet = GetAntiTestSetForUser(data, Subject)

    predictions = algo.test(testSet)
    
    recommendations = []
    
    print ("\nI recommend for user "+str(Subject)+": ")
    for userID, hotelID, actualRating, estimatedRating, _ in predictions:
        intHotelID = int(hotelID)
        recommendations.append((intHotelID, estimatedRating))
    
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return recommendations

def GetAntiTestSetForUser(data, testSubject):
    trainset = data.build_full_trainset()
    fill = trainset.global_mean
    anti_testset = []
    u = trainset.to_inner_uid(str(testSubject))
    print(u)
    user_items = set([j for (j, _) in trainset.ur[u]])
    anti_testset += [(trainset.to_raw_uid(u), trainset.to_raw_iid(i), fill) for
                                i in trainset.all_items() if
                                i not in user_items]
    return anti_testset

class RecSysMain:
    def __init__(self, ratings_path="ratings.csv", model_path="rbm_algo.pkl"):
        self.ratings_path = ratings_path
        self.model_path = model_path
        self.reader = Reader(line_format='user item rating', sep=',', skip_lines=1)
        self.data = Dataset.load_from_file(self.ratings_path, reader=self.reader)
        self.algo = RBMAlgorithm(epochs=20, hiddenDim=10, learningRate=0.01, batchSize=10)
        self.train_and_save()

    def train_and_save(self):
        trainset = self.data.build_full_trainset()
        self.algo.fit(trainset)
        from surprise import dump
        dump.dump(self.model_path, algo=self.algo)

    def load_model(self):
        from surprise import dump
        _, self.algo = dump.load(self.model_path)

    def evaluate(self):
        Evaluated(self.algo, self.data)

    def recommend(self, user_id=1, hotels=None):
        testSet = GetAntiTestSetForUser(self.data, user_id)
        predictions = self.algo.test(testSet)
        
        recommendations = []
        
        for userID, hotelID, actualRating, estimatedRating, _ in predictions:
            intHotelID = int(hotelID)
            if hotels is None or intHotelID in hotels:
                recommendations.append((intHotelID, estimatedRating))
        
        recommendations.sort(key=lambda x: x[1], reverse=True)
        return recommendations

    def run(self, user_id=1, hotels=None):
        if not os.path.exists(self.model_path):
            self.train_and_save()
        else:
            self.load_model()
        return self.recommend(user_id, hotels)
