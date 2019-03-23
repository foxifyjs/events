# Benchmarks

```bash
Starting benchmark init.js

events x 23,791,319 ops/sec ±1.01% (87 runs sampled)
@foxify/events x 483,025,413 ops/sec ±1.59% (80 runs sampled)
eventemitter2 x 481,862,531 ops/sec ±1.53% (79 runs sampled)
eventemitter3 x 247,567,296 ops/sec ±67.03% (41 runs sampled)
drip x 488,237,894 ops/sec ±1.65% (79 runs sampled)
Fastest is drip,@foxify/events,eventemitter2,eventemitter3

Starting benchmark emit-multiple-listeners.js

events x 14,985,760 ops/sec ±1.26% (89 runs sampled)
@foxify/events x 13,954,904 ops/sec ±0.67% (86 runs sampled)
eventemitter2 x 6,259,297 ops/sec ±0.64% (88 runs sampled)
eventemitter3 x 10,934,953 ops/sec ±0.65% (86 runs sampled)
drip x 19,136,880 ops/sec ±0.73% (85 runs sampled)
Fastest is drip

Starting benchmark once.js

events x 4,811,694 ops/sec ±0.63% (87 runs sampled)
@foxify/events x 16,567,962 ops/sec ±0.52% (90 runs sampled)
eventemitter2 x 3,427,744 ops/sec ±1.25% (88 runs sampled)
eventemitter3 x 15,152,769 ops/sec ±0.64% (91 runs sampled)
drip x 11,323,958 ops/sec ±0.97% (89 runs sampled)
Fastest is @foxify/events

Starting benchmark add-remove.js

events x 8,354,135 ops/sec ±0.72% (89 runs sampled)
@foxify/events x 18,446,296 ops/sec ±0.48% (88 runs sampled)
eventemitter2 x 5,904,963 ops/sec ±0.81% (88 runs sampled)
eventemitter3 x 19,462,486 ops/sec ±0.54% (88 runs sampled)
drip x 64,757,620 ops/sec ±0.63% (89 runs sampled)
Fastest is drip

Starting benchmark hundreds.js

events x 369,756 ops/sec ±0.49% (89 runs sampled)
@foxify/events x 508,448 ops/sec ±0.69% (90 runs sampled)
eventemitter2 x 191,715 ops/sec ±0.71% (86 runs sampled)
eventemitter3 x 421,039 ops/sec ±0.53% (89 runs sampled)
drip x 383,288 ops/sec ±0.52% (88 runs sampled)
Fastest is @foxify/events

Starting benchmark emit.js

events x 34,828,710 ops/sec ±0.51% (87 runs sampled)
@foxify/events x 82,156,918 ops/sec ±0.49% (89 runs sampled)
eventemitter2 x 37,913,517 ops/sec ±0.68% (88 runs sampled)
eventemitter3 x 54,082,251 ops/sec ±0.82% (88 runs sampled)
drip x 39,292,422 ops/sec ±0.57% (90 runs sampled)
Fastest is @foxify/events

Starting benchmark listeners.js

events x 8,293,055 ops/sec ±1.52% (86 runs sampled)
@foxify/events x 9,344,364 ops/sec ±0.72% (87 runs sampled)
eventemitter2 x 107,994,684 ops/sec ±0.73% (86 runs sampled)
eventemitter3 x 9,180,382 ops/sec ±0.79% (87 runs sampled)
drip x 106,633,014 ops/sec ±0.43% (90 runs sampled)
Fastest is eventemitter2

Starting benchmark context.js

events x 29,813,390 ops/sec ±0.68% (87 runs sampled)
@foxify/events x 80,168,206 ops/sec ±0.66% (90 runs sampled)
eventemitter2 x 34,430,241 ops/sec ±0.80% (90 runs sampled)
eventemitter3 x 52,889,964 ops/sec ±0.72% (90 runs sampled)
drip x 35,108,972 ops/sec ±0.74% (89 runs sampled)
Fastest is @foxify/events
```