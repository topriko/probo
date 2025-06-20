import {
  ConnectionHandler,
  usePreloadedQuery,
  type PreloadedQuery,
} from "react-relay";
import {
  assetNodeQuery,
  useDeleteAsset,
  useUpdateAsset,
} from "../../../hooks/graph/AssetGraph";
import {
  ActionDropdown,
  Badge,
  Breadcrumb,
  Button,
  DropdownItem,
  Field,
  IconTrashCan,
  Option,
} from "@probo/ui";
import { useTranslate } from "@probo/i18n";
import { useOrganizationId } from "/hooks/useOrganizationId";
import { ControlledField } from "/components/form/ControlledField";
import { PeopleSelectField } from "/components/form/PeopleSelectField";
import { VendorsMultiSelectField } from "/components/form/VendorsMultiSelectField";
import { useFormWithSchema } from "/hooks/useFormWithSchema";
import z from "zod";
import { getAssetTypeVariant, getCriticityVariant } from "@probo/helpers";

const updateAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(1, "Amount is required"),
  criticity: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assetType: z.enum(["PHYSICAL", "VIRTUAL"]),
  dataTypesStored: z.string().min(1, "Data types stored is required"),
  ownerId: z.string().min(1, "Owner is required"),
  vendorIds: z.array(z.string()).optional(),
});

type Props = {
  queryRef: PreloadedQuery<any>;
};

export default function AssetDetailsPage(props: Props) {
  const asset = usePreloadedQuery(assetNodeQuery, props.queryRef);
  const assetEntry = asset.node;
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();
  const deleteAsset = useDeleteAsset(
    assetEntry,
    ConnectionHandler.getConnectionID(organizationId, "AssetsPage_assets")
  );

  const vendors = assetEntry?.vendors?.edges.map((edge: any) => edge.node) ?? [];
  const vendorIds = vendors.map((vendor: any) => vendor.id);

  const { control, formState, handleSubmit, register, reset } = useFormWithSchema(updateAssetSchema, {
    defaultValues: {
      name: assetEntry?.name || "",
      amount: assetEntry?.amount || 0,
      criticity: assetEntry?.criticity || "LOW",
      assetType: assetEntry?.assetType || "VIRTUAL",
      dataTypesStored: assetEntry?.dataTypesStored || "",
      ownerId: assetEntry?.owner?.id || "",
      vendorIds: vendorIds,
    },
  });

  const updateAsset = useUpdateAsset();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await updateAsset({
        id: assetEntry?.id,
        ...formData,
      });
      reset(formData);
    } catch (error) {
      console.error("Failed to update asset:", error);
    }
  });

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          {
            label: __("Assets"),
            to: `/organizations/${organizationId}/assets`,
          },
          {
            label: assetEntry?.name ?? "",
          },
        ]}
      />

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="text-2xl">{assetEntry?.name}</div>
          <Badge variant={getAssetTypeVariant(assetEntry?.assetType)}>
            {assetEntry?.assetType === "PHYSICAL" ? __("Physical") : __("Virtual")}
          </Badge>
          <Badge variant={getCriticityVariant(assetEntry?.criticity)}>
            {assetEntry?.criticity}
          </Badge>
        </div>
        <ActionDropdown variant="secondary">
          <DropdownItem
            variant="danger"
            icon={IconTrashCan}
            onClick={deleteAsset}
          >
            {__("Delete")}
          </DropdownItem>
        </ActionDropdown>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
        <Field
          label={__("Name")}
          {...register("name")}
          type="text"
        />

        <Field
          label={__("Amount")}
          {...register("amount", { valueAsNumber: true })}
          type="number"
        />

        <ControlledField
          control={control}
          name="criticity"
          type="select"
          label={__("Criticity")}
        >
          <Option value="LOW">{__("Low")}</Option>
          <Option value="MEDIUM">{__("Medium")}</Option>
          <Option value="HIGH">{__("High")}</Option>
        </ControlledField>

        <ControlledField
          control={control}
          name="assetType"
          type="select"
          label={__("Asset Type")}
        >
          <Option value="VIRTUAL">{__("Virtual")}</Option>
          <Option value="PHYSICAL">{__("Physical")}</Option>
        </ControlledField>

        <Field
          label={__("Data Types Stored")}
          {...register("dataTypesStored")}
          type="text"
        />

        <PeopleSelectField
          organizationId={organizationId}
          control={control}
          name="ownerId"
          label={__("Owner")}
        />

        <VendorsMultiSelectField
          organizationId={organizationId}
          control={control}
          name="vendorIds"
          label={__("Vendors")}
        />

        <div className="flex justify-end">
          {formState.isDirty && (
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? __("Updating...") : __("Update")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
