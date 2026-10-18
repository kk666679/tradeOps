import numpy as np

def simple_forecast(data, horizon):
    trend = np.mean(np.diff(data))
    last = data[-1]
    return [last + (i+1)*trend for i in range(horizon)]