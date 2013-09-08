(function() {

    var CustomRandom = function(nseed) {
        var constant = Math.pow(2, 13)+1,  
            prime = 37,  
            maximum = Math.pow(2, 50);  
            seed = nseed;  
        return {  
            next: function() {  
                seed *= constant;  
                seed += prime;  
                seed %= maximum;  
                return seed;  
            }
        }
    };

    var generate_level = function(seed, X, Y, rng) {
        var data = [];
        for (var i=0; i<X*Y; i++) {
            data.push(rng.next() % 5);
        }
        return [5, data];
    };
    
    var xprint = function() {};
    
    var try_solve = function(ld, X, Y) {
        var hit, x, y, square, moves=[], more_to_go=true;
        
        while (more_to_go) {
            // hit a random occupied square
            var hit = false;
            while (!hit) {
                x = Math.floor(Math.random() * X);
                y = Math.floor(Math.random() * Y);
                square = ld[(y*X) + x];
                if (square != 0) {
                    hit = true;
                }
            }
            moves.push([x+1,y+1].join("-"));
            ld[(y*X) + x] += 1;
            xprint ("hit square " + x + "-" + y);
            if (ld[(y*X) + x] == 5) {
                xprint ("and it explodes");
                ld[(y*X) + x] = 0;
                exploders = [(y*X) + x];
                while (exploders.length > 0) {
                    xprint("beginning of while loop: exploders is " + exploders);
                    next = exploders.shift();
                    xprint("after shift: exploders is " + exploders);
                    xprint("Checking exploder " + next + " from exploders list length " + exploders.length);
                    xprint("Check left from " + next + " to " + (next-(next%X)));
                    xprint("Check right from " + next + " to " + (next+X-(next%X)));

                    //for (var check=next; check -= 1; check >= (next-(next%X))) {
                    check = next;
                    while (check > (next-(next%X))) {
                        check -= 1;
                        xprint("Checking left; field " + check);
                        checking = ld[check];
                        if (checking != 0) {
                            if (checking == 4) {
                                ld[check] = 0;
                                exploders.push(check)
                                xprint("hit! exploding; exploders is now " + exploders);
                            } else {
                                xprint("hit! incrementing");
                                ld[check] += 1;
                            }
                            break;
                        }
                    }

                    //for (var check=next; check += 1; check <= (next+X-(next%X))) {
                    check = next;
                    while (check <= (next+X-(next%X))) {
                        check += 1;
                        xprint("Checking right; field " + check + " - should be smaller than " + (next+X-(next%X)));
                        checking = ld[check];
                        if (checking != 0) {
                            if (checking == 4) {
                                ld[check] = 0;
                                exploders.push(check)
                                xprint("hit! exploding; exploders is now " + exploders);
                            } else {
                                xprint("hit! incrementing");
                                ld[check] += 1;
                            }
                            break;
                        } 
                    }

                    for (var check=next; check -= X; check >= 0) {
                        xprint("Checking up; field " + check);
                        checking = ld[check];
                        if (checking != 0) {
                            if (checking == 4) {
                                ld[check] = 0;
                                exploders.push(check)
                                xprint("hit! exploding; exploders is now " + exploders);
                            } else {
                                xprint("hit! incrementing");
                                ld[check] += 1;
                            }
                            break;
                        }
                    }

                    for (var check=next; check += X; check < ld.length) {
                        xprint("Checking down; field " + check);
                        checking = ld[check];
                        if (checking != 0) {
                            if (checking == 4) {
                                ld[check] = 0;
                                exploders.push(check)
                                xprint("hit! exploding; exploders is now " + exploders);
                            } else {
                                xprint("hit! incrementing");
                                ld[check] += 1;
                            }
                            break;
                        }
                    }

                }
                xprint ("exit while");
            }
                        
            more_to_go = false;
            for (var i=0; i<ld.length; i++) {
                if (ld[i] != 0 && !isNaN(ld[i])) {
                    more_to_go = true;
                    break;
                }
            }
        }
        return moves;
    };
    
    var init = function() {
        var leveldata = generate_level(1, 9, 9, CustomRandom(1));
        var min_moves = 500;
        var solve_moves;
        for (var tries=0; tries<10000; tries++) {
            var moves = try_solve(leveldata[1].slice(), 9, 9);
            xprint("Solved in " + moves.length + " moves");
            if (moves.length < min_moves) {
                solve_moves = moves;
                min_moves = moves.length;
            }
        }
        print("After many tries, the best solution was " + solve_moves.length + " moves: ");
        print(solve_moves.join(", "));
    };

    init();
    
})();
