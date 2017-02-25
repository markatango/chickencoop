import pickle
import time

def end():
    fp = open("timer.pkl")
    interval = time.time() - pickle.load(fp)
    return interval


if __name__ == '__main__':
    interval = end()
    print('{:4.3}'.format(interval))
