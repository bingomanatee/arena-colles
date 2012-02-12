using System;
namespace MarsUtils
{
	public class IntPoint
	{
		public int x;
		public int y;
		
		public IntPoint (int x_val, int y_val)
		{
			x = x_val;
			y = y_val;
		}
		
		public bool Equals(IntPoint p){
			return (p.x == x) && (p.y == y);
		}
		
		public bool Equals(int px, int py){
			return (px == x) && (py == y);
		}
		
		public Boolean in_list(IntPoint[] points){
			foreach(IntPoint test_point in points){
				if (test_point == this){
					return true;
				}
			}
			
			return false;
		}
	}
}

