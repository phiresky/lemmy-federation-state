import { Temporal } from "@js-temporal/polyfill";
import { useQuery } from "@tanstack/react-query";
import {
  GetFederatedInstancesResponse,
  InstanceWithFederationState,
  LemmyHttp,
} from "lemmy-js-client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { memo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type List = {
  title: string;
  desc: string;
  list: InstanceWithFederationState[];
};

function processResponse(data: GetFederatedInstancesResponse): List[] {
  const linked = data.federated_instances?.linked
    ?.slice()
    .sort(
      (a, b) =>
        a.federation_state?.last_successful_published_time?.localeCompare?.(
          b.federation_state?.last_successful_published_time || ""
        ) || 0
    );

  const deadInstances = [];
  const withFailures = [];
  const lagging = [];
  const current = [];
  for (const instance of linked ?? []) {
    if (
      !instance.updated ||
      Temporal.Instant.compare(
        Temporal.Instant.from(instance.updated),
        Temporal.Now.instant().subtract(Temporal.Duration.from({ hours: 48 }))
      ) < 0
    ) {
      deadInstances.push(instance);
    } else if (instance.federation_state?.fail_count ?? 0 > 0) {
      withFailures.push(instance);
    } else if (
      !instance.federation_state?.last_successful_published_time ||
      Temporal.Instant.compare(
        Temporal.Instant.from(
          instance.federation_state?.last_successful_published_time
        ),
        Temporal.Now.instant().subtract({ minutes: 10 })
      ) < 0
    ) {
      lagging.push(instance);
    } else {
      current.push(instance);
    }
  }
  Object.assign(window, { debug: { linked } });
  const lists = [
    {
      title: "dead instances",
      desc: "Instances that have not been seen for 2 days",
      list: deadInstances,
    },
    {
      title: "failing instances",
      desc: "Instances where the last outgoing event failed to send",
      list: withFailures,
    },
    {
      title: "lagging instances",
      desc: "Instances where send is working but lagging behind by at least 10 minutes",
      list: lagging,
    },
    {
      title: "up to date instances",
      desc: "Instances where sends are succeeding as expected",
      list: current,
    },
  ];
  return lists;
}
function FetchInstanceInfo(params: { domain: string }) {
  const query = useQuery({
    queryKey: ["site-info", params.domain],
    queryFn: async () => {
      const api = new LemmyHttp(`https://${params.domain}`);
      const resp = await api.getFederatedInstances();
      try {
        return processResponse(resp);
      } catch (e) {
        console.error(e);
        if (String(e).includes("time zone")) {
          return "too old";
        }
        return null;
      }
    },
  });
  if (query.status === "pending") {
    return <div>loading...</div>;
  }
  if (query.status === "error") {
    console.error("query error", query.error);
    return <div>{String(query.error)}</div>;
  }

  return (
    <>
      {query.data === "too old" ? (
        <>This instance has not yet been updated to 0.19</>
      ) : (
        query.data?.map((list) => <DetailedInfo list={list} key={list.title} />)
      )}
    </>
  );
}

function DetailedInfo({ list }: { list: List }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible
      className="space-y-2 border-b"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger asChild>
        <div className="flex h-14 lg:h-[60px] items-center gap-4 bg-gray-100/40 px-6 dark:bg-gray-800/40 cursor-pointer">
          <div className="flex-1">
            <h1 className="font-semibold text-lg flex items-center">
              {open ? (
                <ChevronDown className="w-5 h-5 mx-1" />
              ) : (
                <ChevronRight className="w-5 h-5 mx-1" />
              )}
              {list.list.length} {list.title}
            </h1>
            <p className="text-gray-500 text-sm">{list.desc}</p>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="border shadow-sm rounded-lg p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead>Last Successful Send</TableHead>
                <TableHead>Failures of last send</TableHead>
                <TableHead>Last send try</TableHead>
                <TableHead>Next send try</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {open &&
                list.list.map((instance) => {
                  const s = instance.federation_state;
                  return (
                    <TableRow key={instance.id}>
                      <TableCell>{instance.domain}</TableCell>
                      <TableCell>
                        {instance.updated &&
                          new Date(instance.updated).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {s?.last_successful_published_time &&
                          new Date(
                            s.last_successful_published_time
                          ).toLocaleString()}
                      </TableCell>
                      {/*<TableCell>{instance.federation_state?.last_successful_id}</TableCell>*/}
                      <TableCell>{s?.fail_count}</TableCell>
                      <TableCell>
                        {s?.last_retry &&
                          new Date(s.last_retry).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {(s?.fail_count ?? 0 > 0) &&
                          s?.next_retry &&
                          new Date(s.next_retry).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default memo(FetchInstanceInfo);
