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
		public int rows;
		public int cols;

		public int[,] heights;
		private byte[,] mtns;

		public int status = 0;
		public int mtn_status = 0;
		
		private const int RANGE = 3000;

		public const int STATUS_ERROR = -1;
		public const int STATUS_STARTED = 0;
		public const int STATUS_JSON_LOADING = 10;
		public const int STATUS_JSON_LOADED = 20;
		public const int STATUS_BIN_LOADING = 30;
		public const int STATUS_BIN_LOADED = 40;
		public const int STATUS_BIN_PARSED = 50;
		public const int STATUS_TERRAIN_LOADED = 60;
		public const int STATUS_MTN_LOADING = 70;
		public const int STATUS_MTN_LOADED = 80;
		public const int STATUS_MTN_MASKING = 90;
		public const int STATUS_MTN_MASKED = 100;
		public const int STATUS_DONE = 1000000;
		
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
		
		public void set_mtn_mask(Terrain land){
			Debug.Log(" ############### Set Mtn Mask: cols: " + cols.ToString() + ", rows " + rows.ToString());
			Debug.Log("alphamap size: (" +  land.terrainData.alphamapWidth.ToString() + "," +  land.terrainData.alphamapHeight.ToString() + ")");
			float[,,] alphas = land.terrainData.GetAlphamaps(0, 0, cols - 1, rows - 1);
			for (int row = 0; row < rows - 1; ++row){
				for (int col = 0; col < cols - 1; ++col){
					if (((col + row) % 50) == 0){
				//		Debug.Log("Mtn (" + col.ToString() + "," + row.ToString() + ": " + mtns[col, row].ToString());
					}
					if(mtns[row, col] == 0){
						alphas[col, row, 0] = 0.75f;
						alphas[col, row, 1] = 0.0f;
					} else {
						alphas[col, row, 0] = 0.0f;
						alphas[col, row, 1] = 0.75f;
					}
				}
			}
			land.terrainData.SetAlphamaps(0, 0, alphas);
			mtn_status = STATUS_MTN_MASKED;
		}
		
		public void load_mtn_mask(byte[] mask){
			int offset = 0;
			mtns = new byte[cols - 1, rows - 1];
			
			for (int row = 0; row < rows - 1; ++row){
				for (int col = 0; col < cols - 1; ++col){
					mtns[col, row] = mask[offset];
					++offset;
				}
			}
		}

		public WWW json_www ()
		{
			string JSON_url = "http://arenacolles.com/mars/data/" + lat.ToString () + "/" + lon.ToString () + ".json";
			Debug.Log("JSON url: " + JSON_url);
			
			WWW JSON_www = new WWW (JSON_url);
			return JSON_www;
		}

		public WWW bin_smooth_www ()
		{
			string bin_url = "http://arenacolles.com/mars/data/" + lat.ToString () + "/" + lon.ToString () + "/lg/smooth.bin";
			Debug.Log("bin url: " + bin_url);
			
			WWW bin_www = new WWW (bin_url);
			return bin_www;
		}

		public WWW bin_mtn_www ()
		{
			string mtn_url = "http://arenacolles.com/mars/data/" + lat.ToString () + "/" + lon.ToString () + "/lg/mtn.bin";
			Debug.Log("********** MTN url: " + mtn_url);
			
			WWW mtn_www = new WWW (mtn_url);
			return mtn_www;
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

