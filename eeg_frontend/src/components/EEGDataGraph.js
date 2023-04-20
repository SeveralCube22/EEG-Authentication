import React, {useEffect, useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'EEG Data',
        },
    },
};

const EEG_LABELS = ["AF3","F7","F3","FC5","T7","P7","O1","O2","P8","T8","FC6","F4","F8","AF4"];
const EEG_LABEL_COLORS = ['green', 'red', 'blue', 'yellow', 'purple', 'indigo', 'cyan', 'olive', 'cornflowerblue', 'lightslategrey', 'lime', 'teal', 'maroon', 'grey'];
const NUM_TIME_LABELS = 5;

export function EEGDataGraph({eegData}) {
    let [graphData, setGraphData] = useState(null);

    const reformatTimeData = data => {
        let starting = data[0];
        return data.map(e => e - starting);
    }

    const spliceFromEnd = list => {
        let res = [];
        for(let i = list.length - 1; i >= 0 && i >= list.length - NUM_TIME_LABELS; i--)
            res.push(list[i]);
        return res;
    }

    const buildEEGDataset = (splicedTimeData, splicedEEGData) => {
        console.log(splicedTimeData)
        console.log(splicedEEGData)
        return EEG_LABELS.map((label, index) => {
            let graphData = {
                label: label,
                data: splicedTimeData.map((_, i) => splicedEEGData[i][index]),
                borderColor: EEG_LABEL_COLORS[index],
                backgroundColor: EEG_LABEL_COLORS[index]
            }
            return graphData;
        })
    }

    useEffect(() => {
        let splicedTimeData = spliceFromEnd(reformatTimeData(eegData['time']));
        let splicedEEGData = spliceFromEnd(eegData['eeg']);

        let eegDataset = buildEEGDataset(splicedTimeData, splicedEEGData);
        graphData = {labels: splicedTimeData, datasets: eegDataset};
        setGraphData(graphData);
    }, [eegData]);

    return !graphData ? <div/> : <Line options={options} data={graphData} />;
}