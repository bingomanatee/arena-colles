using System;
using System.Collections.Generic;
using UnityEngine;
using System.Collections;

namespace MarsUtils
{
	public class MtnFinder
	{
		public LinkedList<IntPoint> mtn_points;
		// @TODO: split mountain points into sectors

		private float[,] heights;
		private int max_col;
		private int max_row;
		private const int ECHO_INC = 800;
		private const int UPDATE_LOOPS = 400;
		private const int UPDATE_GM = 100;
		private const int GM_LOOPS = 8;
		
		private const int IS_MTN_RANGE = 3;
		// how many points are compared to current to determine moutnainness
		private const int GROW_MTN_RANGE = 2;
		// as above for growth search;
		private const int REALLY_LOWER_HEIGHT = 30;

		public string mode = "find_mtns";
		private int fm_col = 0;
		private int fm_row = 0;

		/******** CONSTRUCTOR ********* */

		public MtnFinder (float[,] h)
		{
			heights = h;
			max_col = heights.GetLength (0) - 1;
			max_row = heights.GetLength (1) - 1;
			mtn_points = new LinkedList<IntPoint> ();
		}

		/* **************** FIND MOUNTAINS **************** */
		
		private int dfm = 0;
		private int gm = 0;
		
		public void update ()
		{
			if (mode == "find_mtns"){
				
				for (int i = 0; i < UPDATE_LOOPS; ++i){
					if  (fm_row < max_row) {
				 		find_mtns ();
					} else {
						mode = "gm";
					}
				}
			} else if (mode == "grow_mtns"){
				for (int g = 0; g < UPDATE_GM; ++g){
					_grow_mountains();
				}
			} else {
				mode = "done";
			}
		}

		public void find_mtns ()
		{
			
		//	Debug.Log ("find_mtns: col" + fm_col.ToString () + ", row" + fm_row.ToString ());
			if (fm_row < max_row) {
				if ((fm_row + fm_col) % ECHO_INC == 0) {
					
					Debug.Log ("find_mtns: col" + fm_col.ToString () + ", row" + fm_row.ToString ());
				}
				if (_is_mountain (fm_col, fm_row)) {
					IntPoint p = new IntPoint (fm_col, fm_row);
					mtn_points.AddLast (p);
					
				}
				++fm_col;
				if (fm_col >= max_col){
					fm_col = 0;
					++fm_row;
				}
			} else {
				Debug.Log("Not Finding Mtns " + dfm.ToString());
				mode = "grow_mtns";
			}
		}

		public bool[,] mtn_array ()
		{
			bool[,] mtns = new bool[max_col + 1, max_row + 1];
			foreach (IntPoint p in mtn_points) {
				mtns[p.x, p.y] = true;
			}
			
			return mtn_array ();
		}

		/* *************** NEIGHBORHOOD SEARCH ***************** */

		private LinkedList<IntPoint> _mtn_neighbors (int col, int row, int range)
		{
			return _mtn_neighbors (new IntPoint (row, col), range);
		}

		private LinkedList<IntPoint> _mtn_neighbors (IntPoint point, int range)
		{
			
			int min_c = Math.Max (0, point.x - range);
			int max_c = Math.Min (max_col, point.x + range);
			
			int min_r = Math.Max (0, point.y - range);
			int max_r = Math.Min (max_row, point.y + range);
			
			LinkedList<IntPoint> neighbors = new LinkedList<IntPoint> ();
			
			IntPoint test_point;
			
			for (int col = min_c; col <= max_c; ++col) {
				for (int row = min_r; row <= max_r; ++row) {
					if (!point.Equals (col, row)) {
						neighbors.AddLast (new IntPoint (col, row));
					}
				}
			}
			
			return neighbors;
		}

		/* *********************** MOUNTAINTOP GROWTH ****************** */
		
		private LinkedList<IntPoint> new_mtns;
		
		private IntPoint last_linked_mtn_pt;
		
		private void _grow_mountains ()
		{
			 if (new_mtns == null){
				new_mtns = new LinkedList<IntPoint> ();
			}
			
			if (last_linked_mtn_pt == null){
				last_linked_mtn_pt = mtn_points.First.Value;
			}
				
			LinkedList<IntPoint> potential_mountains = _mtn_neighbors (last_linked_mtn_pt, 1);
			
			foreach (IntPoint pot_point in potential_mountains) {
				if (_is_mountain (pot_point)) {
					new_mtns.AddLast (pot_point);
				}
			}
			
			last_linked_mtn_pt = mtn_points.Find(last_linked_mtn_pt).Next.Value;
			if (last_linked_mtn_pt == null){
				foreach(IntPoint p in new_mtns){
					mtn_points.AddLast(p);
					new_mtns = new LinkedList<IntPoint>();
				}
				gm++;
				Debug.Log("GM loop " + gm.ToString() + " done");
				if (gm > GM_LOOPS){
					mode = "done";
				}
			}
		}

		// == 30 rise / (500 / UPSCALE from getMarsTerrain) 
		// currently at 4, meaning 30/125 or 1/4 rise

		private bool _is_mountain (int col, int row)
		{
			return _is_mountain (new IntPoint (col, row));
			
		}

		private bool _is_mountain (IntPoint point)
		{
			var samples = 0;
			var lower = 0;
			var same = 0;
			var higher = 0;
			var really_lower = 0;
			
			var height = heights[point.x, point.y];
			
			LinkedList<IntPoint> neighbors = _mtn_neighbors (point, IS_MTN_RANGE);
			
			foreach (IntPoint neighbor in neighbors) {
				if (!neighbor.in_list (mtn_points)) {
					float comp_height = heights[neighbor.x, neighbor.y];
					float rel_height = (height - comp_height);
					
					++samples;
					if (rel_height < 0) {
						++higher;
					} else if (rel_height == 0) {
						++same;
					} else {
						++lower;
						if (rel_height > REALLY_LOWER_HEIGHT) {
							++really_lower;
						}
					}
				}
			}
			
			return _higher_analysis (samples, really_lower, lower, same, higher);
		}

		private bool _higher_analysis (int samples, int really_lower, int lower, int same, int higher)
		{
			if ((lower + same) > higher * 3) {
				// 2/3 of the points are below me
				if ((really_lower) > (0.5 * higher)) {
					// 1/2 of the high points are really higher
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	}
	
}

