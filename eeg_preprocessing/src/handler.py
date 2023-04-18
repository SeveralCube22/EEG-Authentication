import preprocess
import pandas as pd

def handler(event, context):
    data = event["data"]

    test_df = preprocess.tester(data)
    df, ica_objects = preprocess.apply_ica(test_df)
    df = preprocess.window_data(df)
    psd_list = preprocess.extract_features(df.copy())
    selected_columns = ['0_beta', '2_gamma', '3_gamma', '6_gamma', '7_alpha', '9_beta', '9_gamma', '10_gamma', '11_gamma', '12_gamma']

    print(psd_list.shape)
    selected_df = psd_list[selected_columns]

    return selected_df
