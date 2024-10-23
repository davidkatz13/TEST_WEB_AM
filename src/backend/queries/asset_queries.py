from uuid import UUID

from sqlalchemy.orm import Session
from fastapi import HTTPException

from database.tables import AssetModelDB
from schemas.request.asset_request_schema import (
    UpdateAssetRequestSchema,
    CreateAssetRequestSchema,
)


class AssetQueries:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_assets(
        self,
    ):
        """Gets all assets available in db

        Returns:
            AssetModelDB: all asset entires existing in the database
        """
        assets = self.db_session.query(AssetModelDB).all()

        return assets

    def get_asset_by_id(self, asset_id: UUID):
        """Gets a specified asset

        Args:
            asset_id (UUID): asset id by which the correct entry is retrieved

        Returns:
            row(AssetModelDB): gets all asset information for the row retrieved
        """
        asset = (
            self.db_session.query(AssetModelDB)
            .filter(AssetModelDB.id == asset_id)
            .first()
        )

        return asset

    def get_assets_by_category(self, category):
        """Gets all assets that belong to the category specified

        Args:
            category (str): a query parameter category

        Returns:
            list[AssetModelDB]: retrives all assets that belong to certain id
        """

        assets_by_category = (
            self.db_session.query(AssetModelDB)
            .filter(AssetModelDB.category.ilike(f"%{category}%"))
            .all()
        )

        return assets_by_category

    def add_asset(self, asset_create_data: CreateAssetRequestSchema):
        """Adds new asset to the database

        Args:
            asset_create_data (CreateAssetRequestSchema): new data for the asset creation

        Raises:
            e: error occured in the insertion process
        """
        try:
            new_asset = AssetModelDB(
                name=asset_create_data.name,
                category=asset_create_data.category,
                price=asset_create_data.price,
            )
            self.db_session.add(new_asset)
            self.db_session.commit()

            return new_asset
        except Exception as e:
            self.db_session.rollback()
            raise e

    def update_asset_by_id(
        self, asset_id: UUID, asset_update_data: UpdateAssetRequestSchema
    ):
        """Updates data for the asset specified

        Args:
            asset_id (UUID): asset id of the asset that needs to be updated
            asset_update_data (UpdateAssetRequestSchema): new asset data

        Raises:
            e: error occured in the update process
        """
        try:
            asset_to_update = self.db_session.query(AssetModelDB).filter(
                AssetModelDB.id == asset_id
            )

            if not asset_to_update:
                raise HTTPException(
                    status_code=500, detail="Can not update asset that does not exist"
                )

            # convert pydantic schema to dict
            update_data = asset_update_data.model_dump(exclude_none=True)
            asset_to_update.update(update_data)
            self.db_session.commit()

            return asset_to_update.first()
        except Exception as e:
            self.db_session.rollback()
            raise e

    def delete_asset_by_id(self, asset_id: UUID):
        """Deletes asset from the database table

        Args:
            asset_id (UUID): asset that needs to be deleted

        Raises:
            e: error occured in the deletion process
        """
        try:
            asset_to_delete = (
                self.db_session.query(AssetModelDB)
                .filter(AssetModelDB.id == asset_id)
                .first()
            )

            if asset_to_delete:
                self.db_session.delete(asset_to_delete)
                self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            raise e
