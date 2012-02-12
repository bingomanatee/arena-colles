using System;
using System.Collections.Generic;
using UnityEngine;

namespace MarsUtils
{
	public class TerrainUtils
	{
		public TerrainUtils ()
		{
		}

		/*
		 * note - its legitimate for base and result to be the same value
		 */
		public static void diff (float[,] base_heights, float[,] subtract_heights, float[,] result_heights, float blend)
		{
			
			int rows = base_heights.GetLength (0);
			int cols = base_heights.GetLength (1);
			
			for (var row = 0; row < rows; ++row) {
				for (var col = 0; col < cols; ++col) {
					result_heights[row, col] = base_heights[row, col] - subtract_heights[row, col] * blend;
				}
			}
			
		}

		private const int MTN_ITERS = 5;

		public static void color_plains (TerrainData td)
		{
			float[,,] alphas = td.GetAlphamaps (0, 0, td.alphamapWidth, td.alphamapHeight);
			
			Debug.Log ("alphas 0: " + alphas.GetLength (0).ToString ());
			Debug.Log ("alphas 1: " + alphas.GetLength (1).ToString ());
			Debug.Log ("alphas 2: " + alphas.GetLength (2).ToString ());
			
			float[,] heights = new float[td.alphamapWidth, td.alphamapHeight];
			float[,] steeps = new float[td.alphamapWidth, td.alphamapHeight];
			int[,] angle = new int[td.alphamapWidth, td.alphamapHeight];
			int row;
			int col;
			float radius = 2.0f / ((td.alphamapWidth + td.alphamapHeight) * 1.0f);
			
			for (row = 0; row < td.alphamapHeight; ++row) {
				for (col = 0; col < td.alphamapWidth; ++col) {
					
					float x = (float)(row / (td.alphamapHeight * 1.0f));
					float y = (float)(col / (td.alphamapWidth * 1.0f));
					
					Vector3 normal = td.GetInterpolatedNormal (x, y);
					heights[col, row] = td.GetInterpolatedHeight (x, y);
					
					if ((row % 100 == 0) && (col % 100 == 0)) {
						int coli = col / 2;
						int rowi = row / 2;
						//", x: " + x.ToString() + ", y: " + y.ToString() +
						Debug.Log ("row " + row.ToString () + ", col: " + col.ToString () + ": normal: " + normal.ToString () + ".... ALPHA : " + alphas[coli, rowi, 0].ToString () + "....  " + alphas[coli, rowi, 0].ToString ());
						
					}
					
					normal.Normalize ();
					
					steeps[col, row] = normal.y;
					
					angle[col, row] = _normal_angle (normal);
					
				}
			}
			
			bool[,] is_mountain = new bool[td.alphamapWidth, td.alphamapHeight];
			LinkedList<IntPoint> mountain_points = new LinkedList<IntPoint> ();
			
			for (row = 0; row < td.alphamapHeight; ++row) {
				for (col = 0; col < td.alphamapWidth; ++col) {
					if (_is_mountain (heights, row, col)) {
						mountain_points.AddLast (new IntPoint (col, row));
						is_mountain[col, row] = true;
					}
				}
			}
			
			for (int iters = 0; iters < MTN_ITERS; ++iters) {
				_grow_mountains (heights, mountain_points, is_mountain);
			}
			
			for (row = 0; row < td.alphamapHeight; ++row) {
				for (col = 0; col < td.alphamapWidth; ++col) {
					/*
					float steep = steeps[col , row ];
					if ((row % 100 == 0) && (col % 100 == 0)){
						Debug.Log("row " + row.ToString() + ", col: " + col.ToString() + ", steep: " + steep);
					}
					
					float col_float = (float) (col / (1.0f * td.alphamapWidth));
					
					float row_float = (float) (row / (1.0f * td.alphamapHeight));
					//alphas[col, row, 0] = col_float;
					//alphas[col, row, 1] = 1.0f;
					*/					
					
					if (is_mountain[col, row]) {
						alphas[col, row, 0] = 0.8f;
						alphas[col, row, 1] = 0.1f;
					} else {
						alphas[col, row, 0] = 0.1f;
						alphas[col, row, 1] = 0.8f;
					}
				}
			}
			
			td.SetAlphamaps (0, 0, alphas);
			
		}

		private static IntPoint[] _mtn_neighbors (int col,int row, float[,] heights, int range)
		{
			return _mtn_neighbors(new IntPoint(row, col), heights, range);
		}

		private static IntPoint[] _mtn_neighbors (IntPoint point, float[,] heights, int range)
		{
			int max_col = heights.GetLength (0) - 1;
			int max_row = heights.GetLength (1) - 1;
			
			int min_c = Math.Max (0, point.x - range);
			int max_c = Math.Min (max_col, point.x + range);
			
			int min_r = Math.Max (0, point.y - range);
			int max_r = Math.Min (max_row, point.y + range);
			
			
			LinkedList<IntPoint> neighbors = new LinkedList<IntPoint> ();
			
			IntPoint test_point;
			
			for (int col = min_c; col <= max_c; ++col) {
				for (int row = min_r; row <= max_r; ++row) {
					if (!point.Equals(col, row)){
						neighbors.AddLast (new IntPoint (col, row));
					}
				}
			}
			
			IntPoint[] na = new IntPoint[neighbors.Count];
			
			neighbors.CopyTo (na, 0);
			
			return na;
		}

		private static IntPoint[] _mtn_neighbors (IntPoint point, IntPoint[] m_p_array, float[,] heights, int range)
		{
			int max_col = heights.GetLength (0) - 1;
			int max_row = heights.GetLength (1) - 1;
			
			int min_c = Math.Max (0, point.x - range);
			int max_c = Math.Min (max_col, point.x + range);
			
			int min_r = Math.Max (0, point.y - range);
			int max_r = Math.Min (max_row, point.y + range);
			
			
			LinkedList<IntPoint> neighbors = new LinkedList<IntPoint> ();
			
			IntPoint test_point;
			
			for (int col = min_c; col <= max_c; ++col) {
				for (int row = min_r; row <= max_r; ++row) {
					test_point = new IntPoint (col, row);
					if (!(test_point.in_list (m_p_array)) || (test_point == point)) {
						neighbors.AddLast (test_point);
					}
				}
			}
			
			IntPoint[] na = new IntPoint[neighbors.Count];
			
			neighbors.CopyTo (na, 0);
			
			return na;
		}

		private static void _grow_mountains (float[,] heights, LinkedList<IntPoint> mtn_points, bool[,] is_mountain)
		{
			IntPoint[] m_p_array = new IntPoint[mountain_points.Length];
			
			mtn_points.CopyTo (m_p_array, 0);
			LinkedList<IntPoint> new_mountains = new LinkedList<IntPoint>();
			
			foreach (IntPoint point in m_p_array) {
				IntPoint[] potential_mountains = _mtn_neighbors (point, m_p_array, heights, 2);
				
				foreach (IntPoint pot_point in potential_mountains) {
					if (_is_mountain(heights, pot_point, mtn_points)){
						new_mountains.AddLast(pot_point);
					}
				}
			}
			
			while (new_mountains.Count > 0){
				IntPoint last = new_mountains.Last;
				new_mountains.RemoveLast();
				mtn_points.AddAfter(last);
			}
		}

		private const int ECHO_INC = 32;
		private const int BOOL_SCAN = 3;
		private const int REALLY_LOWER_HEIGHT = 30; 
		// == 30 rise / (500 / UPSCALE from getMarsTerrain) currently at 4, meaning 30/125 or 1/4 rise

		private static bool _is_mountain (float[,] heights, IntPoint point, LinkedList<IntPoint> mtn_points)
		{	
			var samples = 0;
			var lower = 0;
			var same = 0;
			var higher = 0;
			var really_lower = 0;
			
			var height = heights[point.x, point.y];
			
			IntPoint neighbors = _mtn_neighbors(point, m_p_array, heights, 2);
			
			IntPoint[] m_p_array = new IntPoint[mountain_points.Length];
			
			mtn_points.CopyTo (m_p_array, 0);
			
			IntPoint[] neighbors = _mtn_neighbors (point, m_p_array, heights, 2);
			
			foreach(IntPoint neighbor in neighbors){
				if (!neighbor.in_list(mtn_points)){
					float rel_height = ( height - comp_height);
						
					++samples;
					if (rel_height < 0)  {
						++higher;
					} else if (rel_height == 0 ) {
						++same;
					} else {
						++lower;
						if (rel_height > REALLY_LOWER_HEIGHT) {
							++really_lower;
						}
					}
				}
			}
		}

		private static bool _is_mountain (float[,] heights, int col, int row)
		{
			float height = heights[col, row];
			
			var samples = 0;
			var lower = 0;
			var same = 0;
			var higher = 0;
			var really_lower = 0;
			
			IntPoint[] neighbors = _mtn_neighbors(col, row, heights, BOOL_SCAN);
			
			for (int c = min_c; c <= max_c; ++c) {
				for (int r = min_r; r <= max_r; ++r) {
					if (!((c == col) && (r == row))) {
						
						float comp_height = heights[c, r];
			
						float rel_height = ( height - comp_height);
						
						++samples;
						if (rel_height < 0)  {
							++higher;
						} else if (rel_height == 0 ) {
							++same;
						} else {
							++lower;
							if (rel_height > REALLY_LOWER_HEIGHT) {
								++really_lower;
							}
						}
						
					}
				}
			}
			
			return _higher_analysis(samples,lower,higher, really_lower);
			
		}
		
		private static bool _higher_analysis(int samples, int lower, int higher, int really_lower){
			if ((lower + same) > higher * 3) { // 2/3 of the points are below me
				if ((really_lower) > (0.5 * higher)) { // 1/2 of the high points are really higher
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

		private static int _normal_angle (Vector3 normal)
		{
			int deg;
			
			if ((normal.x == 0) && (normal.y == 0)) {
				deg = 0;
			} else if (normal.x == 0) {
				if (normal.z > 0) {
					deg = 90;
				} else {
					deg = 270;
				}
				
			} else {
				deg = (int)(180 * Math.Atan (normal.z / normal.x) / Math.PI);
				if (deg < 0) {
					deg += 360;
				} else if (deg > 360) {
					deg -= 360;
				}
			}
			return deg;
		}

		public static void smooth (float[,] terrain_heights, int HEDGE, int skip, float[,] new_buffer)
		{
			int rows = terrain_heights.GetLength (0);
			int cols = terrain_heights.GetLength (1);
			
			Debug.Log ("Smooth rows: " + rows.ToString () + ", cols: " + cols.ToString ());
			
			if (HEDGE < 1) {
				HEDGE = 1;
			}
			if (skip < 1)
				skip = 1;
			for (var row = 0; row < rows; ++row) {
				for (var col = 0; col < cols; ++col) {
					
					float h_fl = 0;
					int count = 0;
					int last_r2i = Mathf.Min (rows, row + HEDGE);
					for (int r2i = Mathf.Max (0, row - HEDGE); r2i < last_r2i; r2i += skip) {
						int last_r2c = Mathf.Min (cols, col + HEDGE);
						for (int c2i = Mathf.Max (0, col - HEDGE); c2i < last_r2c; c2i += skip) {
							++count;
							h_fl += terrain_heights[r2i, c2i];
						}
					}
					h_fl = h_fl / count;
					new_buffer[row, col] = h_fl;
				}
			}
		}
	}
}

