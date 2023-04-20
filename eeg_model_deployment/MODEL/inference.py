import joblib
import os
import json
import pandas as pd
import torch
import torch.nn as nn
import numpy as np

class FFNNModel(nn.Module):
    def __init__(self, input_size, num_classes):
        super(FFNNModel, self).__init__()
        self.fc1 = nn.Linear(input_size, 64)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, num_classes)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.relu(x)
        x = self.fc3(x)
        return x

"""
Deserialize fitted model
"""
def model_fn(model_dir):
    model_info = joblib.load(os.path.join(model_dir, "model.joblib"))

    input_size = model_info['input_size']
    num_classes = model_info['num_classes']
    state_dict = model_info['state_dict']
    scaler = model_info['scaler']

    model = FFNNModel(input_size, num_classes)
    model.load_state_dict(state_dict)
    model.eval()

    return {'model': model, 'scaler': scaler}

"""
input_fn
    request_body: The body of the request sent to the model.
    request_content_type: (string) specifies the format/variable type of the request
"""
def input_fn(request_body, request_content_type):
    if request_content_type == 'application/json':
        request_body = json.loads(request_body)
        inpVar = request_body['Input']
        # Convert to a pandas df aka model acceptable format
        selected_df = pd.read_json(inpVar)
        return selected_df
    else:
        raise ValueError("This model only supports application/json input")

"""
predict_fn
    input_data: returned array from input_fn above
    model (sklearn model) returned model loaded from model_fn above
"""
def predict_fn(input_data, artifacts):
    model = artifacts['model']
    scaler = artifacts['scaler']

    input_np = np.array(input_data)
    input_scaled = scaler.transform(input_np)
    input_tensor = torch.tensor(input_scaled, dtype=torch.float32)

    with torch.no_grad():
        outputs = model(input_tensor)
        _, predicted = torch.max(outputs, 1)
        prediction = predicted.tolist()

    return prediction

"""
output_fn
    prediction: the returned value from predict_fn above
    content_type: the content type the endpoint expects to be returned. Ex: JSON, string
"""

def output_fn(prediction, content_type):
    res = int(prediction[0])
    respJSON = {'Output': res}
    return respJSON

import __main__
setattr(__main__, "FFNNModel", FFNNModel)