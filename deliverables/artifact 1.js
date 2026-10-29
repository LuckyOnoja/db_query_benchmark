const fs = require('fs');
const {performance} = require('perf_hooks');

function loadDataset() {
    const rawData = fs.readFileSync('transactions.json', 'utf8');
    return JSON.parse(rawData);
}

function runUnindexedQuery(data, targetUserId ) {
    const start = performance.now();
    const results = data.filter(tx => tx.userId === targetUserId);
    const end = performance.now();
    return {results, duration: end - start };
}

function buildIndex(data){
    const index = {};
    data.forEach(tx => {
        if(!index[tx.userId]) {
            index[tx.userId] = [];
        }
        index[tx.userId].push(tx);
    });
    return index;
}

function runIndexedQuery (index, targetUserId){
    const start = performance.now();
    const results = index[targetUserId] || [];
    const end = performance.now();
    return{ results, duration: end - start};
}

console.log("Database Query Performance Analysis");
const dataset = loadDataset();
const target = "usr_901";

const unindexedExecution = runUnindexedQuery(dataset, target);
console.log(`[Unindexed Scan]: Found ${unindexedExecution.results.length} records in ${unindexedExecution.duration.toFixed(4)} ms`);

const indexStart = performance.now();
const lookupIndex = buildIndex(dataset);
const indexEnd = performance.now();
console.log(`[Index Construction]: Built index map in ${(indexEnd - indexStart).toFixed(4)} ms`);

const indexedExecution = runIndexedQuery(lookupIndex, target);
console.log(`[Indexed Lookup]: FOund ${indexedExecution.results.length} records in ${indexedExecution.duration.toFixed(4)} ms`);

console.log("Benchmark analysis completed successfully");