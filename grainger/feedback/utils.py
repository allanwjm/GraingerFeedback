import random


def jitter(w):
    return w + random.triangular(-0.5, 0.5)


def sec_to_str(sec):
    m, s = divmod(int(sec), 60)
    return '%02i:%02i' % (m, s)
