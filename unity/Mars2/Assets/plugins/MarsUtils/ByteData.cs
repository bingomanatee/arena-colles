using System;
using UnityEngine;

namespace MarsUtils
{
	public class ByteData
	{
		public ByteData ()
		{
		}
		
		public static void WriteInt(byte[] buffer, int value, int offset) {
		int off_value;
		  if (value >= 0) {
		    WriteUInt(buffer, value, offset);
		  } else {

		  	off_value = 0xffff + value + 1;

		    WriteUInt(buffer, off_value, offset);
		  }
		}
		
		
		public static void WriteUInt(byte[] buffer, int value, int offset) {
			int first_val = 0;
			int second_val = 0;
			int byte_val =  value & 0xff00;
			first_val = byte_val >> 8;
			second_val =  value & 0x00ff;
		
		    buffer[offset] = (byte) first_val;
		    buffer[offset + 1] = (byte) second_val;
		}
				
		public static int ReadInt(byte[] buffer, int offset){	
		  int val = ReadUInt(buffer, offset);
		  int neg = val & 0x8000;
		  return neg == 0 ? val : (0xffff - val + 1) * -1;
		}
		
		public static int ReadUInt(byte[] buffer, int offset){	
			if (offset > buffer.Length - 2){
				throw new UnityException("Attempt to read from past byte stream length " + buffer.Length.ToString()); 
			}
			int val = buffer[offset] << 8;
			val |= buffer[offset + 1];
			return val;
		}
	}
}