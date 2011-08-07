	/** VERTEX POINTS **/
	var verticeIndex = function(vertice) {
		return vertice.x + vertice.y * ((plots_x * plot_vertices) + 1);
	};
	
	var findLattices = (function() {
		function distance(x, y) {
			return Math.pow(x, 2) + Math.pow(y, 2);
		}
		
		function generate_n2(radius) {
	
		    var ymax = [0];
		    var d = 0;
		    
		    var points = [];
		    
		    var batch, x, y;
		    
		    while (d <= radius) {
		        yieldable = []
		        
		        while (true) {
				    batch = [];
				    for (x = 0; x < d+1; x++) {
				        y = ymax[x];
				        if (distance(x, y) <= Math.pow(d, 2)) {
				            batch.push({x: x, y: y});
				            ymax[x] += 1;
			            }
			        }
				    if (batch.length === 0) {
				        break;
			        }
			        points = points.concat(batch);
			    }
		        
		        d += 1
		        ymax.push(0);
	        }
	        
	        return points;
			
		};
		
		return function findLattices(radius, origin) {
			var all_points = [];
			
			var i, point, points = generate_n2(radius);
			for (i = 0; i < points.length; i++) {
				point = points[i];
				
				all_points.push(point);
				if (point.x !== 0) {
					all_points.push({x: -point.x, y: point.y});
				}
				if (point.y !== 0) {
					all_points.push({x: point.x, y: -point.y});
				}
				if (point.x && point.y) {
					all_points.push({x: -point.x, y: -point.y});
				}
			}
			
			for (i = 0; i < all_points.length; i++) {
				all_points[i].x += origin.x;
				all_points[i].y += origin.y;
			};
			
			return all_points;
		}
		
	})()