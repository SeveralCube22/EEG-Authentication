import preprocess
import pandas as pd
import json

def handler(event, context):
    data = event["data"]

    df = preprocess.tester(data)
    ica_df, ica_objects = preprocess.apply_ica(df)
    ica_df = ica_df[0]
    window_df = preprocess.window_data(ica_df)
    psd_list = preprocess.extract_features(window_df)
    selected_columns = ['0_beta', '2_gamma', '3_gamma', '6_gamma', '7_alpha', '9_beta', '9_gamma', '10_gamma', '11_gamma', '12_gamma']

    selected_df = psd_list[selected_columns]

    return selected_df.to_json()
