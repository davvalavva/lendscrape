# 400 Bad Request

> The HyperText Transfer Protocol (HTTP) **400 Bad Request** response status code
> indicates that the server could not understand the request due to invalid syntax.

[400 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)


# 401 Unauthorized

> The HTTP **401 Unauthorized** client error status response code indicates that the
> request has not been applied because it lacks valid authentication credentials
> for the target resource.

> This status is sent with a [WWW-Authenticate header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) that contains information on how to authorize correctly.

> This status is similar to **403**, but in this case, authentication is possible

[401 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401)


# 403 Forbidden

> The HTTP **403 Forbidden** client error status response code indicates that the server understood the request but refuses to authorize it.

> This status is similar to 401, but in this case, re-authenticating will make no difference.
> The access is permanently forbidden and tied to the application logic, such as insufficient rights to a resource.

[403 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)


# 404 File not found

> The HTTP **404 Not Found** client error response code indicates that the server can't find the requested resource.
> Links which lead to a 404 page are often called broken or dead links, and can be subject to link [rot](https://en.wikipedia.org/wiki/Link_rot).

> A 404 status code does not indicate whether the resource is temporarily or permanently missing.
> But if a resource is permanently removed, a 410 (Gone) should be used instead of a 404 status.

[404 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404)


# 405 Method Not Allowed

> The HyperText Transfer Protocol (HTTP) **405 Method Not Allowed** response status code indicates that the request method
> is known by the server but is not supported by the target resource.

> The server MUST generate an **Allow** header field in a 405 response containing a list of the target resource's currently supported methods.

[405 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405)


# 408 Request Timeout

> The HyperText Transfer Protocol (HTTP) **408 Request Timeout** response status code means that the server would like to shut
> down this unused connection. It is sent on an idle connection by some servers, *even without any previous request by the client.*

> A server should send the "close" [Connection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection)
header field in the response, since **408** implies that the server
> has decided to close the connection rather than continue waiting.

> This response is used much more since some browsers, like Chrome, Firefox 27+, and IE9,
> use HTTP pre-connection mechanisms to speed up surfing.

```
Note: some servers merely shut down the connection without sending this message.
```

[408 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408)


# 410 Gone

> The HyperText Transfer Protocol (HTTP) **410 Gone** client error response code indicates that access to the target resource
> is no longer available at the origin server and that this condition is likely to be permanent.

> If you don't know whether this condition is temporary or permanent, a 404 status code should be used instead.

```
Note: A 410 response is cacheable by default.
```

[410 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410)


# 412 Precondition Failed

> The HyperText Transfer Protocol (HTTP) **412 Precondition Failed** client error response code indicates that access
> to the target resource has been denied. This happens with conditional requests on methods other than
[GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) or [HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD)
> when the condition defined by the
[If-Unmodified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since) or [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match)
headers is not fulfilled. In that case, the request,
> usually an upload or a modification of a resource, cannot be made and this error response is sent back.

[412 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412)


# 429 Too Many Requests

> The HTTP **429 Too Many Requests** response status code indicates the user has sent
> too many requests in a given amount of time ("rate limiting").

> A [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
header might be included to this response indicating how long to wait before making a new request.

[429 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)


# 500 Internal Server Error

> The HyperText Transfer Protocol (HTTP) **500 Internal Server Error** server error response code indicates that the
> server encountered an unexpected condition that prevented it from fulfilling the request.

> This error response is a generic "catch-all" response. Sometimes, server administrators log error responses like
> the 500 status code with more details about the request to prevent the error from happening again in the future.

[500 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500)


# 503 Service Unavailable

> The HyperText Transfer Protocol (HTTP) **503 Service Unavailable** server error response code indicates
> that the server is not ready to handle the request.

> Common causes are a server that is down for maintenance or that is overloaded. This response should be used for
> temporary conditions and the [Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
HTTP header should, if possible, contain the estimated time for the recovery of the service.

```
Note: together with this response, a user-friendly page explaining the problem should be sent.
```

> Caching-related headers that are sent along with this response should be taken care of, as a 503 status is often
> a temporary condition and responses shouldn't usually be cached.

[503 - MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503)
