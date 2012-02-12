
	/* 
			
			var r_back: int;
			var r_front: int;
			var c_back: int;
			var c_front: int;
			
			var r_ratio: float;
			var c_ratio: float;
			
			var r_back_c_back_height: float;
			var r_back_c_front_height: float;
			var r_front_c_back_height: float;
			var r_front_c_front_height: float;
			
			var r_back_c_back_scale: float;
			var r_back_c_front_scale: float;
			var r_front_c_back_scale: float;
			var r_front_c_front_scale: float;
			
			r_back = Mathf.FloorToInt(r2);
					 r_front = Mathf.CeilToInt(r2);
					
					 c_back = Mathf.FloorToInt(c2);
					 c_front = Mathf.CeilToInt(c2);
					
					r_back_c_back_height   = utf_values[r_back, c_back];
					r_back_c_front_height  = utf_values[r_back, c_front];
					r_front_c_back_height  = utf_values[r_front, c_back];
					r_front_c_front_height = utf_values[r_front, c_front];
					
					c_ratio = (c2 - c_back);
					r_ratio = (r2 - r_back);
					
					
					if (r_back == r_front){
						if (c_back == c_front){
							h_interp = utf_values[r_back, c_back];
						} else {
							h_interp = utf_values[r_back, c_back] * c_ratio;
							h_interp += utf_values[r_back, c_front] * (1 - c_ratio);
						}
						
					} else if (c_back == c_front){
						h_interp = utf_values[r_back, c_back] * r_ratio;
						h_interp += utf_values[r_back, c_front] * (1 - r_ratio);
					
					} else { */
					/*
					if ((r2 < 10) && (c2 < 10)){
						Debug.Log('r_front: ' + r_front + ', r_back: ' + r_back + ', c_front: ' + c_front + ', c_back: ' + c_back);
						Debug.Log('r2: ' + r2 + ', c2: ' + c2);
						Debug.Log('c_ratio: ' + c_ratio + ', r_ratio: ' + r_ratio);
					}
					
					if ((c_ratio == 0) && (r_ratio == 0)){
						h_interp = r_back_c_back_height;
					} else {
						r_back_c_back_scale   = Mathf.Sqrt(c_ratio * c_ratio + r_ratio * r_ratio);
						r_back_c_front_scale  = Mathf.Sqrt((1 - c_ratio) * (1 - c_ratio) + r_ratio * r_ratio);
						r_front_c_back_scale  = Mathf.Sqrt(c_ratio * c_ratio + (1 -r_ratio) * (1 - r_ratio));
						r_front_c_front_scale = Mathf.Sqrt((1 - c_ratio) * (1 - c_ratio) + (1 -r_ratio) * (1 - r_ratio));
						
						h_interp = (r_back_c_back_height * r_back_c_back_scale);
						h_interp += (r_back_c_front_height * r_back_c_front_scale);
						h_interp += (r_front_c_back_height * r_front_c_back_scale);
						h_interp += (r_front_c_front_height * r_front_c_front_scale);
						h_interp /= (r_back_c_back_scale + r_back_c_front_scale + r_front_c_back_scale + r_front_c_front_scale);
						
						if ((r2 < 10) && (c2 < 10)){
							Debug.Log('r_back_c_back_scale: ' + r_back_c_back_scale + ', r_back_c_front_scale: ' + r_back_c_front_scale 
							+ ', r_front_c_back_scale: ' + r_front_c_back_scale + ', r_front_c_front_scale: ' + r_front_c_front_scale);
							
							Debug.Log('r_back_c_back_height: ' + r_back_c_back_height + ', r_back_c_front_height: ' + r_back_c_front_height 
							+ ', r_front_c_back_height: ' + r_front_c_back_height + ', r_front_c_front_height: ' + r_front_c_front_height);
							
							Debug.Log('back back = ' + (r_back_c_back_height * r_back_c_back_scale));
							Debug.Log('back front = ' + (r_back_c_front_height * r_back_c_front_scale));
							Debug.Log('front back = ' + (r_front_c_back_height * r_front_c_back_scale));
							Debug.Log('front front = ' + (r_front_c_front_height * r_front_c_front_scale));
							Debug.Log('total h_interp = ' + h_interp);
						}
						
					} */
					
					//}
