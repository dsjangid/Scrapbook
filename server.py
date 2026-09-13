import os
import re
import sys
from http import HTTPStatus
from http.server import HTTPServer, SimpleHTTPRequestHandler

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = os.path.split(self.path)
            if parts[0] == "":
                self.send_error(HTTPStatus.NOT_FOUND, "File not found")
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return super().send_head()

        ctype = self.guess_type(path)
        if path.endswith('.m4a'):
            ctype = 'audio/mp4'
        elif path.endswith('.mp3'):
            ctype = 'audio/mpeg'
        elif path.endswith('.mp4'):
            ctype = 'video/mp4'

        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return None

        try:
            fs = os.fstat(f.fileno())
            file_len = fs[6]

            range_header = self.headers.get('Range')
            if range_header:
                match = re.match(r'^bytes=(\d+)-(\d*)$', range_header.strip())
                if match:
                    start = int(match.group(1))
                    end = int(match.group(2)) if match.group(2) else file_len - 1
                    if start >= file_len:
                        self.send_error(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                        f.close()
                        return None
                    if end >= file_len:
                        end = file_len - 1
                    content_length = end - start + 1

                    self.send_response(HTTPStatus.PARTIAL_CONTENT)
                    self.send_header("Content-Type", ctype)
                    self.send_header("Content-Range", f"bytes {start}-{end}/{file_len}")
                    self.send_header("Content-Length", str(content_length))
                    self.send_header("Accept-Ranges", "bytes")
                    self.send_header("Cache-Control", "no-cache")
                    self.end_headers()

                    f.seek(start)
                    self._range_len = content_length
                    return f

            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(file_len))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self._range_len = file_len
            return f
        except Exception:
            f.close()
            raise

    def copyfile(self, source, outputfile):
        if hasattr(self, '_range_len'):
            bytes_to_send = self._range_len
            bufsize = 64 * 1024
            while bytes_to_send > 0:
                chunk_size = min(bufsize, bytes_to_send)
                chunk = source.read(chunk_size)
                if not chunk:
                    break
                outputfile.write(chunk)
                bytes_to_send -= len(chunk)
        else:
            super().copyfile(source, outputfile)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    server = HTTPServer(('0.0.0.0', port), RangeRequestHandler)
    print(f"Serving on http://localhost:{port} with HTTP Range support...")
    server.serve_forever()
