namespace SRFM.MediaServices.API
{
    public enum StreamStatus
    {
        Upcoming, //is the default state of the status, that will be when the user schedules the stream
        Idle, //when the stream is between the dates of streaming, this is for the user to know that his stream is open or ready to be use
        Live, // when the user starts streaming       
        Suspended //when its done
    }

    public enum StreamType
    {
        liveStream,
        vod,
        relayService
    }
}
