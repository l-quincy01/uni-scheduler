# schemas.py
from pydantic import BaseModel, Field
from typing import List


class ExamItem(BaseModel):
    title: str = Field(min_length=2)
    date: str  # e.g., "Thu - 23 October 2025"
    time: str  # e.g., "AM (09H00)"


class CategoryDoc(BaseModel):
    category: str
    exams: List[ExamItem]
