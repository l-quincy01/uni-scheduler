from typing import List, Dict, Any
from db import modules_coll


def upsert_modules(grouped: List[Dict[str, Any]]) -> dict:
    """
    Upsert
    """
    cats = 0
    exams_added = 0
    for doc in grouped:
        cat = doc["category"]
        exams = doc.get("exams", [])
        modules_coll.update_one(
            {"category": cat},
            {"$setOnInsert": {"category": cat, "exams": []}},
            upsert=True,
        )
        if exams:
            modules_coll.update_one(
                {"category": cat}, {"$addToSet": {"exams": {"$each": exams}}}
            )
            exams_added += len(exams)
        cats += 1
    return {"categories": cats, "exams_added": exams_added}
