from uuid import UUID
from typing import Optional

from pydantic import BaseModel


class AssetResponseModelSchema(BaseModel):
    id: UUID
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
