from bs4 import BeautifulSoup
from collections import defaultdict
from typing import List, Dict, Any


def _clean(node) -> str:
    return " ".join(node.get_text(" ", strip=True).split()) if node else ""


def parse_exam_table(html: str) -> List[Dict[str, Any]]:

    soup = BeautifulSoup(html, "lxml")
    rows = soup.select("tbody > tr") or soup.select("tr")

    current_date = None
    grouped = defaultdict(list)

    for tr in rows:
        ths = tr.find_all("th")
        if ths:
            if len(ths) == 1 and ths[0].has_attr("colspan"):
                current_date = _clean(ths[0])
            continue

        tds = tr.find_all("td")
        if len(tds) >= 3 and current_date:
            department = _clean(tds[0])
            session = _clean(tds[1])
            desc = _clean(tds[2])
            if department and session and desc:
                grouped[department].append(
                    {"title": desc, "date": current_date, "time": session}
                )

    return [{"category": dept, "exams": exams} for dept, exams in grouped.items()]
