import { Identity } from "@semaphore-protocol/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Stepper from "@/components/stepper"
import Divider from "@/components/divider"

export default function Home() {
  const router = useRouter()

  // State to store the user's Semaphore identity.
  // You can learn more about Semaphore identity here
  // https://docs.semaphore.pse.dev/V3/guides/identities.
  const [_identity, setIdentity] = useState<Identity>()

  // Environment variable for local storage key.
  const localStorageTag = process.env.NEXT_PUBLIC_LOCAL_STORAGE_TAG!

  // Effect to load identity from local storage or prompt creation.
  useEffect(() => {
    const identityString = localStorage.getItem(localStorageTag)

    if (identityString) {
      // If identity exists in local storage, load it.
      const identity = new Identity(identityString)

      setIdentity(identity)

      console.log(
        "Your Semaphore identity was retrieved from the browser cache 👌🏽"
      )
    } else {
      console.log("Create your Semaphore identity 👆🏽")
    }
  }, [localStorageTag])

  // Function to create a new Semaphore identity and store it.
  const createIdentity = async () => {
    const identity = new Identity()

    setIdentity(identity)

    localStorage.setItem(localStorageTag, identity.export())

    console.log("Your new Semaphore identity was just created 🎉")
  }

  const renderIdentity = () => {
    return (
      <div className="lg:w-2/5 md:w-2/4 w-full">
        <div className="flex justify-between items-center mb-3">
          <div className="text-2xl font-semibold text-slate-700">Identity</div>
          <div>
            <button
              className="flex justify-center items-center w-auto space-x-1 verify-btn text-lg font-medium rounded-md bg-gradient-to-r text-slate-700"
              onClick={createIdentity}
            >
              <span>New</span>
            </button>
          </div>
        </div>

        {_identity && (
          <div className="flex justify-center items-center">
            <div className="overflow-auto border-2 p-7 border-slate-300 space-y-3">
              {/* Display identity details: Trapdoor, Nullifier, Commitment */}
              <div>
                <b>Private Key (base64)</b>:<br />
                {_identity.export()}
              </div>
              <div>
                <b>Public Key</b>:<br /> [{_identity?.publicKey[0].toString()},{" "}
                {_identity.publicKey[1].toString()}]
              </div>
              <div>
                <b>Commitment</b>:<br /> {_identity.commitment.toString()}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div>
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-semibold text-slate-700">Identities</h1>
        </div>
        <div className="flex justify-center items-center mt-10">
          <span className="lg:w-2/5 md:w-2/4 w-full">
            <div>
              Users interact with Bandada using a{" "}
              <a
                className="space-x-1 text-blue-700 hover:underline"
                href="https://docs.semaphore.pse.dev/guides/identities"
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                Semaphore identity
              </a>{" "}
              (similar to Ethereum accounts). This identity consists of an{" "}
              <a
                className="space-x-1 text-blue-700 hover:underline"
                href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/eddsa-poseidon"
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                EdDSA
              </a>{" "}
              public/private key pair and a commitment, used as the public
              identifier of the identity.
            </div>
            <Divider />
          </span>
        </div>
        <div className="flex justify-center items-center mt-5">
          {/* Render identity details or creation button based on state */}
          {_identity ? (
            renderIdentity()
          ) : (
            <button
              className="flex justify-center items-center w-auto space-x-3 verify-btn text-lg font-medium rounded-md px-5 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-slate-100"
              onClick={createIdentity}
            >
              Create identity
            </button>
          )}
        </div>
        <div className="flex justify-center items-center mt-10">
          <div className="lg:w-2/5 md:w-2/4 w-full">
            {/* Stepper component for navigation, enabled if identity exists */}
            <Stepper
              step={1}
              onNextClick={_identity && (() => router.push("/groups"))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
