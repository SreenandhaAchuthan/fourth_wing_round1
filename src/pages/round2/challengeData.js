export const challengeData = {
    1: {
        title: "The Nested Loop Bridge",
        story: "In the depths of the Cyber-Canyon, a massive chasm blocks your path. The ancient bridge mechanism relies on a 2D array matrix to stabilize its structure. The logic circuits have decayed, and the nested loops required to traverse the matrix are fragmented. You must reconstruct the loop control structures to bridge the gap and continue your journey.",
        hint: "A nested loop for a 2D array typically uses an outer loop for rows (i) and an inner loop for columns (j). Remember to initialize your iterators to 0 and check against the array dimensions (rows, cols)!",
        rules: ["Fix the nested loop structure.", "3 Wrong attempts will auto-skip the challenge."],
        penalties: ["Wrong Answer: -2 Marks", "Hint: -2 Marks", "Skip: 0 Marks"]
    },
    2: {
        title: "The Algorithm Locks",
        story: "You reach the Fortress of Algorithms, but the main gate is sealed by five cryptographic locks. These locks are synchronized to a specific array summation algorithm. Only by placing the correct code segments into the key slots can you satisfy the logic gates and unseal the entrance.",
        hint: "To sum an array, you need to declare a sum variable initialized to 0. Then, loop through the array adding each element (arr[i]) to the sum. Finally, return the calculated sum.",
        rules: ["Place code segments in the correct order.", "3 Wrong attempts will auto-skip the challenge."],
        penalties: ["Wrong Answer: -2 Marks", "Hint: -2 Marks", "Skip: 0 Marks"]
    },
    3: {
        title: "The Memory Core",
        story: "Deep within the fortress, you encounter a corrupted memory core. Data fragments are floating in flux. To restore the system's processing loop, you must pair the scattered code instructions with their functional descriptions. Synchronization is key to stabilizing the core.",
        hint: "Match the code syntax to its purpose. 'int i = 0' is initialization. 'i < n' is a condition. 'i++' is an increment. 'sum += arr[i]' is the loop body.",
        rules: ["Match code segments to their descriptions.", "Unlimited attempts allowed."],
        penalties: ["Wrong Answer: -2 Marks", "Hint: -2 Marks", "Skip: 0 Marks"]
    },
    4: {
        title: "The Search Sequence",
        story: "The central database is vast, and a critical data packet is hidden within. The system's Linear Search protocol has been scrambled. You need to reorder the execution steps to successfully locate the target value within the data stream. One wrong step, and the search will fail.",
        hint: "A linear search checks elements one by one. Start at index 0. Loop while i < n. If arr[i] matches the target, return the index. If the loop finishes without finding it, return -1.",
        rules: ["Reorder the steps for Linear Search.", "3 Wrong attempts will auto-skip the challenge."],
        penalties: ["Wrong Answer: -2 Marks", "Hint: -2 Marks", "Skip: 0 Marks"]
    },
    5: {
        title: "The Signal Towers",
        story: "Communication with the surface has been severed. The signal towers on the ridge are offline or misaligned. The control grid is interconnected; activating one tower affects its neighbors. You must find the correct sequence of activations to light up the entire network green.",
        hint: "Clicking a tower toggles it AND its immediate neighbors. Try to chase the 'off' lights to one end, or use a pattern to clear them. If you get stuck, reset and try a different starting move.",
        rules: ["Light up all signal towers green.", "3 Wrong attempts will auto-skip the challenge."],
        penalties: ["Wrong Answer: -2 Marks", "Hint: -2 Marks", "Skip: 0 Marks"]
    },
    6: {
        title: "The Dragon's Hoard",
        story: "You've awakened the Guardian Dragon! It demands a tribute of maximum value before it lets you pass. However, your saddlebag has a strict weight limit. You must choose the items carefully to maximize the treasure's value without exceeding the dragon's weight allowance.",
        hint: "This is a Knapsack problem. Look for items with high Value-to-Weight ratios. The Sword and Gem are valuable, but watch the weight! You need to fit as much value as possible into the 20kg limit.",
        rules: ["Maximaize value within weight limit.", "3 Wrong attempts will auto-skip the challenge."],
        penalties: ["Wrong Answer: -2 Marks", "Hint: -2 Marks", "Skip: 0 Marks"]
    },
    7: {
        title: "The Reactive Outrun",
        story: "The security system detects your presence! 'Venin' hunter drones are deployed in the sector. They react to your every move. You must navigate the grid to the extraction point while outsmarting the patrol algorithms. Use your ability to rewind time if you get cornered.",
        hint: "The Venins have fixed patrol paths. Observe their movements before you commit. Use the Undo button (or Ctrl+Z) if you make a mistake. You don't need to be fast, just precise.",
        rules: ["Reach the extraction point.", "Avoid the Venin drones.", "3 Wrong attempts will auto-skip the challenge."],
        penalties: ["Wrong Answer: -2 Marks", "Hint: -2 Marks", "Skip: 0 Marks"]
    },
    8: {
        title: "The Warp Gates",
        story: "The final barrier is a network of Warp Gates. To escape, you must manually synchronize the gate frequencies by calculating the shortest path through the node network. The distance metrics must be precise to establish a stable wormhole.",
        hint: "This is Dijkstra's Algorithm (Shortest Path). Start at Node A (0). For each neighbor, distance = current_node_dist + edge_weight. Update neighbors only if the new path is shorter. Always process the unvisited node with the smallest known distance next.",
        rules: [
            "Calculate shortest paths from the source (Node A).",
            "Update distances accurately for each node.",
            "Reach the target node with the optimal cost.",
            "Click 'Verify Data' to check your calculations."
        ],
        penalties: [
            "Incorrect Distance: -2 Marks",
            "Unstable Calculation: -2 Marks",
            "Hint Usage: -2 Marks"
        ]
    },
    9: {
        title: "The Grand Alliance",
        story: "The final stage of the war requires a global unification of fragmented resistance pockets. You must bridge these fragments using the cheapest connections available across the entire realm to form one unified alliance before the Venin cut your lines.",
        hint: "This is Kruskal's algorithm. Click edges to select them for your spanning tree. Sort edges by weight (already done in sidebar), then select the cheapest edges that don't create cycles. You need exactly 12 edges to connect 13 nodes without cycles.",
        rules: ["Connect all nodes using Kruskal's Algorithm.", "Standard scoring applies."],
        penalties: ["Wrong Answer: -2 Marks", "Hint: -2 Marks", "Skip: 0 Marks"]
    }
};


