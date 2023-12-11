"use client";

import { InstanceList } from "@/components/instance-list";

export default function SiteInfo({ params }: { params: { domain: string } }) {
  return <InstanceList domain={params.domain} />;
  /*return (
    <div>
      <h2>Federated Instances of {params.domain}</h2>
      {lists.map((list) => (
        <details key={list.title} >
            <summary>
                <h3>{list.list.length} {list.title}</h3>
                <h4>{list.desc}</h4>
            </summary>
        <table className="table-auto" >
          <thead>
            <tr>
              {[
                  "Domain",
                  "Last seen",
                  "Last Successful Send",
                  "Failures of last send",
                  "Last send try",
                  "Next send try",
                ].map((e) => (
                    <td key={e}>{e}</td>
                    ))}
            </tr>
          </thead>
          <tbody>
            {list.list.map((instance) => {
                const s = instance.federation_state;
                return (
                    <tr key={instance.id}>
                  <td>{instance.domain}</td>
                  <td>
                    {instance.updated &&
                      new Date(instance.updated).toLocaleString()}
                  </td>
                  <td>
                    {s?.last_successful_published_time &&
                      new Date(
                          s.last_successful_published_time
                          ).toLocaleString()}
                  </td>
                  {/*<td>{instance.federation_state?.last_successful_id}</td>}
                  <td>{s?.fail_count}</td>
                  <td>
                    {s?.last_retry && new Date(s.last_retry).toLocaleString()}
                  </td>
                  <td>
                    {s?.next_retry && new Date(s.next_retry).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
      ))}
    </div>
  );*/
}
