<script context="module" lang="ts">
	export const Relay_Lua_Module = () => {
		let _tags = [{ name: "Action", value: "Relay-Module" }];
		return _tags;
	};

	export const Eval = () => {
		let _tags = [{ name: "Action", value: "Eval" }];
		return _tags;
	};

	export const Subscribe = (relay: string) => {
		let _tags = [
			{ name: "Action", value: "Subscribe" },
			{ name: "Relay", value: relay },
		];
		return _tags;
	};

	export const UnSubscribe = (relay: string) => {
		let _tags = [
			{ name: "Action", value: "UnSubscribe" },
			{ name: "Relay", value: relay },
		];
		return _tags;
	};

	export const SetOwner = (owner: string) => {
		let _tags = [
			{ name: "Action", value: "SetOwner" },
			{ name: "_Owner", value: owner },
		];
		return _tags;
	};

	export const SetRelay = (relay: string) => {
		let _tags = [
			{ name: "Action", value: "SetRelay" },
			{ name: "Relay", value: relay },
		];
		return _tags;
	};

	export const GetOwner = () => {
		let _tags = [{ name: "Action", value: "GetOwner" }];
		return _tags;
	};

	export const Info = () => {
		let _tags = [{ name: "Action", value: "Info" }];
		return _tags;
	};

	export const Subs = (page: string, size: string) => {
		let _tags = [
			{ name: "Action", value: "Subs" },
			{ name: "Page", value: page },
			{ name: "Size", value: size },
		];
		return _tags;
	};

	export const Subscriptions = (page: string, size: string) => {
		let _tags = [
			{ name: "Action", value: "Subscriptions" },
			{ name: "Page", value: page },
			{ name: "Size", value: size },
		];
		return _tags;
	};

	export const IsSubscribed = (relay: string) => {
		let _tags = [
			{ name: "Action", value: "IsSubscribed" },
			{ name: "Relay", value: relay },
		];
		return _tags;
	};

	export const FetchFeed = (filters: string) => {
		return [
			{ name: "Action", value: "FetchFeed" },
			{ name: "Filters", value: filters },
		];
	};

	export const FetchEvents = (filters: string) => {
		return [
			{ name: "Action", value: "FetchEvents" },
			{ name: "Filters", value: filters },
		];
	};

	export const UpdateProfile = () => {
		return [
			{ name: "Action", value: "Update-Profile" },
		];
	};

	//REGISTRY METHODS

	export const Register = () => {
		return [
			{ name: "Action", value: "Register" }
		];
	};

	export const GetZones = (filters: string, page: string, limit: string) => {
		return [
			{ name: "Action", value: "GetZones" },
			{ name: "Filters", value: filters },
			{ name: "Page", value: page },
			{ name: "Limit", value: limit },
		];
	};

	export const GetZoneById = (zoneId: string) => {
		return [
			{ name: "Action", value: "GetZoneById" },
			{ name: "ZoneId", value: zoneId }
		];
	};

	export const RelayMessage = (owner: string) => {
		let _tags = [
			{ name: "Action", value: "Relay" },
			{ name: "_Owner", value: owner },
		];
		return _tags;
	};

	export const Relays = (page: string, size: string) => {
		let _tags = [
			{ name: "Action", value: "Relays" },
			{ name: "Page", value: page },
			{ name: "Size", value: size },
		];
		return _tags;
	};
</script>
