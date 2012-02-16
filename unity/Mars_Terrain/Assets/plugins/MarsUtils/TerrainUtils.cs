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

		public static void color_plains (TerrainData td, bool[,] mtns)
		{
			float[,,] alphas = td.GetAlphamaps(0, 0, td.alphamapWidth, td.alphamapHeight);
			
			for (int col = 0; col < td.alphamapWidth; ++col) {
				for (int row = 0; row < td.alphamapHeight; ++row) {
					
					if (mtns[col, row]) {
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

