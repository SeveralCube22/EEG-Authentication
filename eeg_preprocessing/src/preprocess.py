import pandas as pd
import numpy as np
import mne
from scipy.signal import welch

#Testing function
def tester(input_data):
    freq_bands = ['EEG.AF3', 'EEG.F7', 'EEG.F3', 'EEG.FC5', 'EEG.T7', 'EEG.P7', 'EEG.O1', 'EEG.O2', 'EEG.P8', 'EEG.T8', 'EEG.FC6', 'EEG.F4', 'EEG.F8', 'EEG.AF4']
    test_df = pd.DataFrame(input_data, columns=freq_bands)
    return test_df

def apply_ica(df):
    sfreq = 128.0
    n_components = 6
    method = 'fastica'
    random_state = 42
    l_freq = 1.0
    h_freq = 50.0
    filter_length = 'auto'
    fir_design = 'firwin'
    ref_channels = 'average'
    ch_names = ['EEG.AF3', 'EEG.F7', 'EEG.F3', 'EEG.FC5', 'EEG.T7', 'EEG.P7', 'EEG.O1', 'EEG.O2', 'EEG.P8', 'EEG.T8', 'EEG.FC6', 'EEG.F4', 'EEG.F8', 'EEG.AF4']
    eog_ch_names = ['EEG.AF3', 'EEG.F7', 'EEG.F8', 'EEG.AF4', 'EEG.F3', 'EEG.F4']

    preprocessed_data = []
    ica_objects = []

    data = df.to_numpy()
    info = mne.create_info(ch_names, sfreq, ch_types=['eeg'] * 14)
    raw = mne.io.RawArray(data.T, info)

    eog_indices = [ch_names.index(ch) for ch in eog_ch_names]
    ch_types = ['eog' if i in eog_indices else 'eeg' for i in range(len(ch_names))]
    raw.set_channel_types(dict(zip(ch_names, ch_types)))

    raw = filter_data(raw, l_freq, h_freq, filter_length, fir_design)
    raw.set_eeg_reference(ref_channels=ref_channels)

    ica = create_and_apply_ica(raw, n_components, method, random_state)

    ica_objects.append(ica)
    preprocessed_data.append(pd.DataFrame(raw.get_data().T, columns=ch_names))

    return (preprocessed_data,ica_objects)

def filter_data(raw, l_freq, h_freq, filter_length, fir_design):
    raw.filter(l_freq=l_freq, h_freq=h_freq, l_trans_bandwidth='auto', h_trans_bandwidth='auto', filter_length=filter_length, fir_design=fir_design)
    return raw

def create_and_apply_ica(raw, n_components, method, random_state):
    ica = mne.preprocessing.ICA(n_components=n_components, method=method, random_state=random_state, max_iter=16000)
    ica.fit(raw)

    eog_epochs = mne.preprocessing.create_eog_epochs(raw, reject_by_annotation=False)
    eog_inds, eog_scores = ica.find_bads_eog(eog_epochs)
    ica.exclude += eog_inds
    ica.apply(raw)

    return ica

def window_data(df_list):

    window_size = 256
    overlap = 0.5

    windowed_data = []

    for i, df in enumerate(df_list):
        windows = []
        start = 0
        end = window_size

        while end <= len(df):
            window = df.iloc[start:end].to_numpy().T
            windows.append(window)

            start += int(window_size * (1 - overlap))
            end += int(window_size * (1 - overlap))

        windowed_data.append(windows)

    return windowed_data

def extract_features(windowed_data):
    freq_bands = {'delta': (1, 4),
                  'theta': (4, 8),
                  'alpha': (8, 12),
                  'beta': (12, 30),
                  'gamma': (30, 50)}

    features_list = []

    for user_windows in windowed_data:
        features = []

        for window in user_windows:
            psd_features = []

            for channel in window:
                nperseg = min(len(channel), 128)
                freqs, psd = welch(channel, fs=128, nperseg=nperseg, nfft=nperseg)

                band_powers = []
                for fmin, fmax in freq_bands.values():
                    idx_min = np.argmax(freqs >= fmin)
                    idx_max = np.argmax(freqs >= fmax)
                    band_powers.append(np.sum(psd[idx_min:idx_max]))

                psd_features.append(band_powers)

            features.append(np.array(psd_features).flatten())

        column_names = [f'{ch}_{band}' for ch in range(len(window)) for band in freq_bands.keys()]
        features_df = pd.DataFrame(features, columns=column_names)
        features_list.append(features_df)

    return features_list