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

		public int[,] heights;
		public float[,] scaled_heights;
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
		public const int STATUS_BIN_SCALED = 55;
		public const int STATUS_TERRAIN_LOADED = 60;
		public const int STATUS_TERRAIN_WEATHERING = 70;
		public const int STATUS_TERRAIN_WEATHERED = 80;
		public const int STATUS_TERRAIN_WRITING = 90;
		public const int STATUS_TERRAIN_WRITTEN = 100;
		
		public const int STATUS_MTN_LOADING = 10;
		public const int STATUS_MTN_LOADED = 20;
		public const int STATUS_MTN_MASKING = 30;
		public const int STATUS_MTN_MASKED = 40;
		public const int STATUS_EXISTS = 1000;
		public const int STATUS_DONE = 1000000;
		
		public int scale = 1;

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
		
		public int rows {
			get { return  (base_rows - 1) * scale + 1; }
		}
		
		public int cols {
			get { return  (base_cols - 1) * scale + 1; }
		}
		
		public int base_rows {
			get { return  json_data.rows;  }
		}
		
		public int base_cols {
			get { return  json_data.cols;  }
		}

		/* ***************** METHODS ************ */
		
		public void set_mtn_mask(Terrain land){
			Debug.Log(" ############### Set Mtn Mask: cols: " + cols.ToString() + ", rows " + rows.ToString());
			Debug.Log("alphamap size: (" +  land.terrainData.alphamapWidth.ToString() + "," +  land.terrainData.alphamapHeight.ToString() + ")");
			float[,,] alphas = land.terrainData.GetAlphamaps(0, 0, cols - 1, rows - 1);
			int s = 0;
			for (int row = 0; row < rows - 1; ++row){
				for (int col = 0; col < cols - 1; ++col){
					if (((col + row) % 50) == 0){
				//		Debug.Log("Mtn (" + col.ToString() + "," + row.ToString() + ": " + mtns[col, row].ToString());
					}
					byte mtn = mtns[row, col];
					if (s++ % 100 == 0) {
					//		Debug.Log("Mtn (" + col.ToString() + "," + row.ToString() + "): " + mtn.ToString());
					}
					
					alphas[col, row, 0] = Mathf.Min(1.0f, Mathf.Max(0f, (float) ((255 - mtn) / 255.0)));
					alphas[col, row, 1] =  Mathf.Min(1.0f, Mathf.Max(0f, (float) (( mtn) / 255.0)));
				/*	if(mtns[row, col] == 0){
						alphas[col, row, 0] = 0.75f;
						alphas[col, row, 1] = 0.0f;
					} else {
						alphas[col, row, 0] = 0.0f;
						alphas[col, row, 1] = 0.75f;
					} */
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

		public WWW bin_www (){
			string bin_url = "http://arenacolles.com/mars/data/" + lat.ToString () + "/" + lon.ToString () + ".raw";
			Debug.Log("bin url: " + bin_url);
			
			WWW bin_www = new WWW (bin_url);
			return bin_www;
		}
		
		public WWW bin_smooth_www (int s)
		{
			scale = s;
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
			
			Debug.Log("Creating Heights: (" + cols.ToString() + "," + rows.ToString() + ")");
			
			for (int row = 0; row < heights_f.GetLength(0); ++row) {
				for (int col = 0; col < heights_f.GetLength(1); ++col) {
					heights_f[col, row] = Mathf.Min(1.0f, Mathf.Max(0.0f, (float) (heights[col, row] - min)/RANGE));
				}
			}
			
			land.terrainData.SetHeights(0, 0, heights_f);
		}
		public void set_terrain_heights_from_scaled(Terrain land){
			float[,] heights_f = new float[cols, rows];
			
			
			for (int row = 0; row < rows; ++row) {
				for (int col = 0; col < cols; ++col) {
					heights_f[col, row] = scaled_heights[col, row];
				}
			}
			
			land.terrainData.SetHeights(0, 0, heights_f);
		}

		public void load_heights (byte[] byte_data)
		{
			int n = byte_data.Length/2;
			float p = Mathf.Sqrt(n);
			
			Debug.Log("================================ \ncount of points loaded: " + n.ToString() + "; row/height loaded: "  + p.ToString());			
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
			
			Debug.Log("min: " + min.ToString() + ", max: " + max.ToString() );
			
		}
		/*
		public void weather_terrain(Terrain land){
			float blend = 0.15f;
			float freq = 10.0f;
			int oct = 8;
			float amp = 1.0f;
			TerrainToolkit t = (TerrainToolkit) land.GetComponent("TerrainToolkit");
			t.PerlinGenerator(freq, amp, oct, blend);
			
			int reps = 10;
			float cutting = 0.025f;
			float rain = 0.01f;
			float evap   = 0.25f;
			float solubility = 0.005f;
			float saturation = 0.02f;
			float velocity = 0.75f;
			float mom = 0.25f;
			int entropy = 1;
			t.VelocityHydraulicErosion(reps, rain, evap, solubility, saturation, 
			velocity, mom, entropy, cutting); 	
		} */
		
		public byte[] scaled_to_buffer(Terrain land){
			  
			int buf_count = rows * cols * 2;
			byte[] buffer = new byte[buf_count];
			int offset = 0;
			
			float[,] terrain_heights = land.terrainData.GetHeights(0, 0, rows, cols);
			for (int row = 0; row < rows; ++row) {
				for (int col = 0; col < rows; ++col){
					int height = min + (int) Math.Floor(terrain_heights[col, row] * RANGE);
					ByteData.WriteInt(buffer, height, offset);
					offset += 2;
				}
			}
			
			return buffer;
		}
		
		public void scale_heights (int new_scale){
			int row;
			int col;
			int unscaled_row;
			int unscaled_col;
			
			scale = new_scale;
			
			float[,] jagged_heghts = new float[cols, rows];
			scaled_heights = new float[cols, rows];	

			for ( row = 0; row < rows; ++row) {
				for ( col = 0; col < cols; ++col) {
					float value = 0f;
					int sampled;
					float ag_sampled;
					float count = 0f;
					
					int min_row = (int) Math.Max(0, row - scale);
					int max_row = (int) Math.Min(rows - 1, row + scale);
					int min_col = (int) Math.Max(0, col - scale);
					int max_col = (int) Math.Min(cols - 1, col + scale);
					
					for (int r = min_row; r <= max_row; ++r){
						for (int c = min_col; c <= max_col; ++c){
							
							 unscaled_row = (int) Math.Min(base_rows - 1, Math.Round( (double) ( r / (1.0 * scale))));
							 unscaled_col = (int) Math.Min(base_cols - 1, Math.Round( (double) ( c / (1.0 * scale))));
					        try {
							 sampled = heights[unscaled_row, unscaled_col];
							 ++count;
							 if (row < 10 && col < 10){
							// 	Debug.Log("sampled: (" + r.ToString() + "," + c.ToString() + ") unscaled_row, col: " + unscaled_row.ToString() + "," + unscaled_col.ToString() + ": " + sampled.ToString());
							 }							value += sampled;
							} catch (IndexOutOfRangeException e){
								Debug.Log(" c, r ---------- out of bounds: " + c.ToString() + "," + r.ToString() + ")");
								throw e;
							}
						}
					}
					
					ag_sampled = (float) (value) / (count * 1.0f);
					ag_sampled -= min;
					ag_sampled /= RANGE;
					if (row < 10 && col < 10){
				//	Debug.Log("ag_sampled: " + ag_sampled.ToString());
					}
					
					scaled_heights[col, row] = ag_sampled;
				}
			}
			
		}
		
	}
}

