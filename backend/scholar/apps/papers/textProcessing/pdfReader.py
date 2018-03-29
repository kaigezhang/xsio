import hashlib
import logging
import xml.etree.cElementTree as ET
from datetime import datetime
from io import BytesIO as StringIO
from multiprocessing.dummy import Pool as ThreadPool
from urllib import parse as urlparse

import requests
from dateutil import parser
from django.conf import settings

log = logging.getLogger(__name__)


class PdfReader():

  def __init__(self):
    self.url = urlparse.urljoin(settings.GROBID_HOST, 'api/processHeaderDocument')

  def connect(self, check_delay=2):
    log.info('检查Grobid是否运行')
    try:
      r = requests.get(settings.GROBID_HOST + '/isalive')
      r.raise_for_status()  # raise if not 200
      return True
    except:
      return False

  def convert(self, pdf_binary):
    # 存储处理后的结果
    hash = hashlib.md5(pdf_binary).hexdigest()
    out = {hash: {}}
    try:
      log.info('开始转换')
      out[hash]['result'] = self.parse_xml(self.run_grobid(pdf_binary))
    except Exception as e:
      log.error(u'Grobid 启动错误! :( \n 发生异常: {}'.format(e))
      out[hash]['_parse_error'] = True
    return out

  def covert_batch(self, pdf_binary_list, num_threads=None):
    if num_threads is None:
      nun_threads = settings.GROBID_THREADS

    pool = ThreadPool(num_threads)
    return pool.map(self.convert, pdf_binary_list)

  def run_grobid(self, pdf_binary, MAX_TRIES=5):
    files = {'input': pdf_binary}
    # files = {'input': pdf_binary, 'consolidateHeader': '1'}
    r = requests.post(self.url, files=files)

    try:
      r.raise_for_status()  # raise is not http: 200
    except Exception:
      log.info('请求Grobid服务失败，发生了下面的错误')
      log.error(r.text)
      raise
    return r.text

  def parse_xml(self, xml_string):
    output = {}
    author_list = []
    path = []
    for event, elem in ET.iterparse(StringIO(xml_string.encode('utf-8')), events=("start", "end")):
        if event == 'start':
            path.append(elem.tag)
        elif event == 'end':
            if elem.tag == '{http://www.tei-c.org/ns/1.0}abstract':
                output['abstract'] = (self._extract_text(elem))
            elif elem.tag == '{http://www.tei-c.org/ns/1.0}title' and '{http://www.tei-c.org/ns/1.0}titleStmt' in path:
                output['title'] = self._extract_text(elem)
            elif elem.tag == '{http://www.tei-c.org/ns/1.0}persName' and '{http://www.tei-c.org/ns/1.0}fileDesc' in path:
                forenames = [e.text for e in elem.findall(
                    '{http://www.tei-c.org/ns/1.0}forename')]
                lastnames = [e.text for e in elem.findall(
                    '{http://www.tei-c.org/ns/1.0}surname')]
                initials = [f[0] for f in forenames]
                # NB the format below is identical to that used in pubmed_robot.py
                author_list.append({"initials": u''.join(initials),
                                    "forename": u' '.join(forenames),
                                    "lastname": u' '.join(lastnames)})
            elif elem.tag == '{http://www.tei-c.org/ns/1.0}date' and elem.attrib.get('type') == 'published' and '{http://www.tei-c.org/ns/1.0}fileDesc' in path:
                DEFAULT = datetime(1800, 1, 1)
                extracted_date = elem.attrib.get('when')
                if extracted_date:
                    try:
                        parsed_date = parser.parse(extracted_date)
                    except:
                        parsed_date = DEFAULT
                    output["year"] = parsed_date.year
                    output["month"] = parsed_date.month
            elif elem.tag == '{http://www.tei-c.org/ns/1.0}biblScope' and '{http://www.tei-c.org/ns/1.0}fileDesc' in path:

                unit = elem.attrib.get('unit')
                if unit == 'volume':
                    output["volume"] = elem.text
                elif unit == 'issue':
                    output["volume"] = elem.text
                elif unit == 'page':
                    page_from = elem.attrib.get('from')
                    page_to = elem.attrib.get('to')
                    if page_from:
                        output["page_from"] = page_from
                    if page_to:
                        output["page_to"] = page_to
                    if page_from and page_to:
                        output["pages"] = "{}-{}".format(
                            page_from, page_to)
            elif elem.tag == '{http://www.tei-c.org/ns/1.0}title' and '{http://www.tei-c.org/ns/1.0}fileDesc' in path:
                output['journal'] = elem.text
            path.pop()

    output['authors'] = author_list
    return output

  def _extract_text(self, elem):
    # note the whitespace on the join here.
    return u' '.join([s.decode("utf-8") for s in ET.tostringlist(
        elem, method="text", encoding="utf-8") if s is not None]).strip()  # don't ask...
