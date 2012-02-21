using System;
using System.Net;
using System.IO;
using UnityEngine;

namespace MarsUtils
{
	public class SendRaw
	{
		private const int READ_INC = 1024;
		
		public static void send (string url, byte[] data)
		{
			HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create (url);
			req.ContentType = "text/binary";
			req.ContentLength = data.Length;
			req.Method = "POST";
			Debug.Log("sending data to " + url);
			var req_stream = req.GetRequestStream();
			var fromi = 0;
			
			Debug.Log("data length: " + data.Length.ToString());
			do {
				req_stream.Write(data, fromi, READ_INC);
			    req_stream.Flush();
				//Debug.Log("from " + fromi.ToString() );

				fromi += READ_INC;
			} while (fromi < data.Length - READ_INC);
			
			if (fromi < data.Length){
				req_stream.Write(data, fromi, data.Length - fromi);
				Debug.Log("from " + fromi.ToString() + " to " + data.Length + ": stream length = " );

			}
			
			Debug.Log("Data Length = " + data.Length.ToString());
			req_stream.Flush();
			req_stream.Close();
		}
	}
}
/*
    public static void Test()
    {
        string baseAddress = "http://" + Environment.MachineName + ":8000/Service";
        ServiceHost host = new ServiceHost(typeof(Service), new Uri(baseAddress));
        host.AddServiceEndpoint(typeof(ITest), GetBinding(), "").Behaviors.Add(new WebHttpBehavior());
        host.Open();
        Console.WriteLine("Host opened");

        HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(baseAddress + "/UploadFile/Test.xml");
        req.Method = "POST";
        req.ContentType = "text/xml";
        Stream reqStream = req.GetRequestStream();
        string fileContents = "<hello>world</hello>";
        byte[] fileToSend = Encoding.UTF8.GetBytes(fileContents);
        reqStream.Write(fileToSend, 0, fileToSend.Length);
        reqStream.Close();
        HttpWebResponse resp = (HttpWebResponse)req.GetResponse();
        Console.WriteLine("HTTP/{0} {1} {2}", resp.ProtocolVersion, (int)resp.StatusCode, resp.StatusDescription);
        host.Close();
    } */