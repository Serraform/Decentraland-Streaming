import logging
import azure.functions as func
import streamlink

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    twitch_url = req.params.get('twitch_url')
    if not twitch_url:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            twitch_url = req_body.get('twitch_url')

    if twitch_url:
        twitch_url_string=str(twitch_url)
        logging.info(twitch_url_string)
        twitch_streams = streamlink.streams(twitch_url_string)
        logging.info(twitch_streams)
        best_stream_url = twitch_streams['best'].url
        logging.info(best_stream_url)
        return func.HttpResponse(f"{best_stream_url}",status_code=200)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
