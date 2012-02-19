using System;
using System.Collections.Generic;
using UnityEngine;
using JsonFx.Json;

namespace MarsUtils
{
	public class GetHeightFile
	{
		public int lat;
		public int lon;
		private int start_time;

		private int max;
		private int min;
		private int rows;
		private int cols;

		public int[,] heights;

		public int status = 0;
		
		private const int RANGE = 3000;

		public const int STATUS_ERROR = -1;
		public const int STATUS_STARTED = 0;
		public const int STATUS_JSON_LOADING = 10;
		public const int STATUS_JSON_LOADED = 20;
		public const int STATUS_BIN_LOADING = 30;
		public const int STATUS_BIN_LOADED = 40;
		public const int STATUS_BIN_PARSED = 50;
		public const int STATUS_TERRAIN_LOADED = 60;
		
		public const int SIZE_SCALE = 4;

		private HeightJsonData _json_data;

		/* *************** CONSTRUCTOR ************* */

		public GetHeightFile (int plat, int plon)
		{
			lat = plat;
			lon = plon;
		}

		/* ***************** PROPS ************** */

		private int _last_time = 0;
		public int last_time {
			get { return _last_time; }

			set { _last_time = value; }
		}

		public HeightJsonData json_data {
			get { return _json_data; }

			set { _json_data = value; }
		}

		/* ***************** METHODS ************ */

		public WWW json_www ()
		{
			string JSON_url = "http://arenacolles.com/mars/data/" + lat.ToString () + "/" + lon.ToString () + ".json";
			Debug.Log("JSON url: " + JSON_url);
			
			WWW JSON_www = new WWW (JSON_url);
			return JSON_www;
		}

		public WWW bin_smooth_www ()
		{
			string bin_url = "http://arenacolles.com/mars/data/" + lat.ToString () + "/" + lon.ToString () + "/smoothed.bin";
			Debug.Log("bin url: " + bin_url);
			
			WWW bin_www = new WWW (bin_url);
			return bin_www;
		}
		
		public void set_terrain_heights(Terrain land){
			float[,] heights_f = new float[cols, rows];
			
			
			for (int row = 0; row < rows; ++row) {
				for (int col = 0; col < cols; ++col) {
					heights_f[col, row] = Mathf.Min(1.0f, Mathf.Max(0.0f, (float) (heights[col, row] - min)/RANGE));
				}
			}
			
			land.terrainData.SetHeights(0, 0, heights_f);
		}

		public void load_heights (byte[] byte_data)
		{
			int n = byte_data.Length/2;
			float p = Mathf.Sqrt(n);
			
			Debug.Log("count of points loaded: " + n.ToString() + "; expected heights: "  + p.ToString());			
			 rows = (json_data.rows - 1) * SIZE_SCALE + 1;
			 cols = (json_data.cols - 1) * SIZE_SCALE + 1;
			
			Debug.Log("rows: " + rows.ToString() + ", cols: " + cols.ToString());

			heights = new int[rows, cols];
			var offset = 0;
			
			for (int row = 0; row < rows; ++row) {
				for (int col = 0; col < cols; ++col) {
					int h_int = ByteData.ReadInt (byte_data, offset);
					heights[col, row] = h_int;
					
					if ((row == 0) && (col == 0)) {
						min = h_int;
						max = h_int;
					} else if (min > h_int) {
						min = h_int;
					} else if (max < h_int) {
						max = h_int;
					}
					offset += 2;
					
				}
			}
			
		}
		
	}
}

