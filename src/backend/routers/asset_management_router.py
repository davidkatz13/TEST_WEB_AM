from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from database.database_connection import database_handler
from schemas.request.asset_request_schema import (
    CreateAssetRequestSchema,
    UpdateAssetRequestSchema,
)
from schemas.response.asset_response_schema import AssetResponseModelSchema
from queries.asset_queries import AssetQueries


router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("/", response_model=List[AssetResponseModelSchema])
def get_assets(session: Session = Depends(database_handler.get_session)):
    asset_query = AssetQueries(db_session=session)

    return asset_query.get_assets()


@router.get("/category/{category_name}", response_model=List[AssetResponseModelSchema])
def get_assets_by_category(
    category_name: str, session: Session = Depends(database_handler.get_session)
):
    asset_query = AssetQueries(db_session=session)

    return asset_query.get_assets_by_category(category=category_name)


@router.get("/{asset_id}", response_model=AssetResponseModelSchema)
def get_asset_by_id(
    asset_id: str, session: Session = Depends(database_handler.get_session)
):
    asset_query = AssetQueries(db_session=session)

    return asset_query.get_asset_by_id(asset_id=asset_id)


@router.post("/", response_model=AssetResponseModelSchema)
def add_asset(
    asset_data: CreateAssetRequestSchema,
    session: Session = Depends(database_handler.get_session),
):
    asset_query = AssetQueries(db_session=session)

    return asset_query.add_asset(asset_create_data=asset_data)


@router.put("/{asset_id}", response_model=AssetResponseModelSchema)
def update_asset(
    asset_id: str,
    update_data: UpdateAssetRequestSchema,
    session: Session = Depends(database_handler.get_session),
):
    asset_query = AssetQueries(db_session=session)

    return asset_query.update_asset_by_id(
        asset_id=asset_id, asset_update_data=update_data
    )


@router.delete("/{asset_id}")
def delete_asset(
    asset_id: str, session: Session = Depends(database_handler.get_session)
):
    asset_query = AssetQueries(db_session=session)

    return asset_query.delete_asset_by_id(asset_id=asset_id)
