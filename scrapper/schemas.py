# schemas.py
from pydantic import BaseModel, Field
from typing import List


class ExamItem(BaseModel):
    title: str = Field(min_length=2)
    date: str
    time: str


class CategoryDoc(BaseModel):
    category: str
    exams: List[ExamItem]
