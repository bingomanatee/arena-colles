using System;
using UnityEngine;

namespace MarsUtils
{
	public class ByteData
	{
		public ByteData ()
		{
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