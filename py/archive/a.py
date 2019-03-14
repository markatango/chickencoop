import pickle
import time

def start():
    now = time.time()
    fp = open("timer.pkl", "w")
    pickle.dump(now, fp)
    return now


if __name__ == '__main__':
    now = start()
    print('Start time{:4.3}'.format(now))

    



